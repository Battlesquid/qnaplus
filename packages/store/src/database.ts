import { config } from "@qnaplus/config";
import { RealtimePostgresUpdatePayload, createClient } from "@supabase/supabase-js";
import { Change, diffSentences } from "diff";
import { Logger } from "pino";
import { Question, fetchCurrentSeason, fetchQuestionsIterative, getAllQuestions as archiverGetAllQuestions, getOldestUnansweredQuestion, Season, getOldestQuestion } from "vex-qna-archiver";
import { OnPayloadQueueFlush, PayloadQueue } from "./payload_queue";
import { Database } from "./supabase";
import { UploadMetadata, upload } from "./upload";

const supabase = createClient<Database>(config.getenv("SUPABASE_URL"), config.getenv("SUPABASE_KEY"))
const METADATA_ROW_ID = 0;

export type StoreOptions = {
    logger?: Logger;
}

export const populate = async (logger?: Logger) => {
    const questions = await archiverGetAllQuestions(logger);
    return insertQuestions(questions, { logger });
}

export const populateWithMetadata = async (logger?: Logger) => {
    const questions = await archiverGetAllQuestions(logger);
    const currentSeason = await fetchCurrentSeason(logger);

    const oldestUnansweredQuestion = getOldestUnansweredQuestion(questions, currentSeason);
    const oldestQuestion = getOldestQuestion(questions, currentSeason);

    // assert non-null since we know the scraper is starting from the beginning
    // meaning we are practically guaranteed at least one "oldest question" 
    const oldestQuestionId = oldestUnansweredQuestion !== undefined
        ? oldestUnansweredQuestion.id
        : oldestQuestion!.id;

    await insertQuestions(questions, { logger });
    logger?.info("Successfully populated database");

    const { error } = await supabase
        .from("questions_metadata")
        .upsert({ id: METADATA_ROW_ID, current_season: currentSeason, oldest_unanswered_question: oldestQuestionId });

    if (error) {
        logger?.error({ error }, "Unable to populate question metadata");
    } else {
        logger?.info({ oldest_question_id: oldestQuestionId, current_season: currentSeason }, "Successfully populated metadata")
    }
}

export const getQuestion = async (id: Question["id"], opts?: StoreOptions): Promise<Question | null> => {
    const logger = opts?.logger?.child({ label: "getDocument" });
    const row = await supabase.from("questions").select().eq("id", id).single();
    if (row.error !== null) {
        logger?.trace(`No question with id '${id}' found.`);
    }
    return row.data;
}

export const getAllQuestions = async (opts?: StoreOptions): Promise<Question[]> => {
    const logger = opts?.logger?.child({ label: "getAllQuestions" });
    let hasRows = true;
    let page = 0;
    const LIMIT = 1000;
    const data: Question[] = [];
    while (hasRows) {
        const from = page * LIMIT;
        const to = from + LIMIT;
        const rows = await supabase
            .from("questions")
            .select("*", { count: "exact" })
            .range(from, to);
        if (rows.error !== null) {
            logger?.error(rows.error);
            continue;
        }
        data.push(...rows.data);
        page++;
        hasRows = rows.data.length === LIMIT;
    }
    logger?.info(`Retreived all questions (${data.length}) from database.`);
    return data;
}

export const insertQuestion = async (data: Question, opts?: StoreOptions) => {
    const logger = opts?.logger?.child({ label: "insertQuestion" });
    const { error, status } = await supabase.from("questions").insert(data);
    logger?.trace({ error, status });
}

export const insertQuestions = async (data: Question[], opts?: StoreOptions) => {
    const logger = opts?.logger?.child({ label: "insertQuestions" });
    const { error, status } = await supabase.from("questions").insert(data);
    logger?.trace({ error, status });
}

export const upsertQuestions = async (data: Question[], opts?: StoreOptions) => {
    const logger = opts?.logger?.child({ label: "upsertQuestions" });
    logger?.info(`Upserting ${data.length} questions`)
    const { error, status } = await supabase.from("questions").upsert(data, { ignoreDuplicates: false });
    if (error !== null) {
        logger?.warn({ error, status })
    }
    return error === null;
}

const CHANGE_EVENTS = ["answered", "answer_edited"] as const;

export type ChangeEvent = typeof CHANGE_EVENTS[number];
export type ChangeCondition<T> = (newItem: T, oldItem: Partial<T>) => boolean;
export type ChangeHandler<T, U> = (newItem: T, oldItem: Partial<T>) => U;

export type ChangeQuestion = AnsweredQuestion | AnswerEditedQuestion;

export interface AnsweredQuestion extends Question {
    changeType: "answered";
}

export interface AnswerEditedQuestion extends Question {
    changeType: "answer_edited";
    diff: Change[];
}

type ChangeMap<T> = {
    [P in ChangeEvent]: {
        matches: ChangeCondition<T>;
        format: ChangeHandler<T, ChangeTypeMap[P]>;
    }
}

export type ChangeTypeMap = {
    answered: AnsweredQuestion;
    answer_edited: AnswerEditedQuestion;
}

const CHANGE_MAP: ChangeMap<Question> = {
    answered: {
        matches(newItem, oldItem) {
            return oldItem.answered === false
                && newItem.answered;
        },
        format(newItem, _) {
            return { ...newItem, changeType: "answered" };
        }
    },
    answer_edited: {
        matches(newItem, oldItem) {
            return Boolean(oldItem.answer)
                && Boolean(newItem.answer)
                && oldItem.answer !== newItem.answer;
        },
        format(newItem, oldItem) {
            // based on the above condition, we can safely use non-null assertion
            const diff = diffSentences(oldItem.answer!, newItem.answer!);
            return { ...newItem, changeType: "answer_edited", diff };
        }
    }
}

const classifyChanges = (items: RealtimePostgresUpdatePayload<Question>[]) => {
    const changes: ChangeQuestion[] = [];
    for (const { old: oldQuestion, new: newQuestion } of items) {
        for (const event of CHANGE_EVENTS) {
            if (CHANGE_MAP[event].matches(newQuestion, oldQuestion)) {
                changes.push(CHANGE_MAP[event].format(newQuestion, oldQuestion));
            }
        }
    }
    return changes;
}

export type OnChangeOptions = {
    [P in ChangeEvent]?: OnPayloadQueueFlush<Question>;
}

export type ChangeCallback = (items: ChangeQuestion[]) => void | Promise<void>;

export const onChange = (callback: ChangeCallback, logger?: Logger) => {
    const queue = new PayloadQueue<RealtimePostgresUpdatePayload<Question>>({
        onFlush(items) {
            const changes = classifyChanges(items);
            if (changes.length < 1) {
                logger?.info("No changes detected.");
                return;
            }
            logger?.info(`${changes.length} changes detected.`);
            callback(changes);
        }
    });
    return supabase
        .channel("db-changes")
        .on<Question>(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "questions",
            },
            payload => queue.push(payload)
        )
        .subscribe();
}

export const doDatabaseUpdate = async (_logger?: Logger) => {
    const logger = _logger?.child({ label: "doNotificationUpdate" });
    const { error: metadataError, data } = await supabase.from("questions_metadata")
        .select("*")
        .eq("id", 0)
        .single();
    if (metadataError) {
        logger?.error({ error: metadataError }, "Error retrieving question metadata, exiting");
        return;
    }

    const { current_season, oldest_unanswered_question } = data;
    logger?.info(`Starting update from Q&A ${oldest_unanswered_question}`);
    const questions = await fetchQuestionsIterative({ logger, start: parseInt(oldest_unanswered_question) });
    const success = await upsertQuestions(questions, { logger });
    if (success) {
        logger?.info(`Updated ${questions.length} questions.`);
    }

    const oldestUnanswered = getOldestUnansweredQuestion(questions, current_season as Season);
    if (oldestUnanswered === undefined) {
        logger?.info("Oldest unanswered question not found, skipping metadata update.")
        return;
    }

    const { error } = await supabase
        .from("questions_metadata")
        .upsert({ id: METADATA_ROW_ID, oldest_unanswered_question: oldestUnanswered.id });

    if (error) {
        logger?.error({ error, oldest_unanswered_id: oldestUnanswered.id }, `Unable to save oldest unanswered question (${oldestUnanswered.id}) to metadata`);
    } else {
        logger?.info({ oldest_unanswered_id: oldestUnanswered.id }, `Successfully updated metadata with oldest unanswered question (${oldestUnanswered.id})`);
    }
}

export const doWebappUpdate = async (_logger?: Logger) => {
    const logger = _logger?.child({ label: "doWebappUpdate" });
    const questions = await getAllQuestions({ logger });
    const json = JSON.stringify(questions);
    // typed as any to address limitation in tus-js-client (https://github.com/tus/tus-js-client/issues/289)
    const buffer: any = Buffer.from(json, "utf-8");
    const metadata: UploadMetadata = {
        bucket: "qnaplus",
        filename: "questions.json",
        type: "application/json"
    }
    try {
        await upload(buffer, metadata, logger);
    } catch (e) {
        logger?.error({ error: e }, "Error while updating webapp json")
    }
}
