import {config} from "@qnaplus/config";
import { RealtimePostgresUpdatePayload, createClient } from "@supabase/supabase-js";
import { Change, diffSentences } from "diff";
import { Logger } from "pino";
import { Question, fetchCurrentSeason, fetchQuestionsIterative, getAllQuestions as archiverGetAllQuestions } from "vex-qna-archiver";
import { OnPayloadQueueFlush, PayloadQueue } from "./payload_queue";
import { Database } from "./supabase";

const supabase = createClient<Database>(config.getenv("SUPABASE_URL"), config.getenv("SUPABASE_KEY"))

export type StoreOptions = {
    logger?: Logger;
}

export const populate = async (logger?: Logger) => {
    const { questions } = await archiverGetAllQuestions(logger);
    return insertQuestions(questions, { logger });
}

export const getQuestion = async (id: Question["id"], opts?: StoreOptions): Promise<Question | null> => {
    const logger = opts?.logger?.child({ label: "getDocument" });
    const row = await supabase.from("questions").select().eq("id", id).single();
    if (row.error === null) {
        logger?.trace(`No question with id '${id}' found.`);
    }
    return row.data;
}

export const getAllQuestions = async (opts?: StoreOptions): Promise<Question[] | null> => {
    const logger = opts?.logger?.child({ label: "getAllQuestions" });
    const rows = await supabase.from("questions").select("*");
    if (rows.error === null) {
        logger?.trace(rows.error);
    }
    return rows.data;
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

export const onChange = (callback: ChangeCallback) => {
    const queue = new PayloadQueue<RealtimePostgresUpdatePayload<Question>>({
        onFlush(items) {
            const changes = classifyChanges(items);
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

export const update = async (logger?: Logger) => {
    const season = await fetchCurrentSeason(logger);
    const { error, data: question } = await supabase
        .from("questions")
        .select("*")
        .eq("season", season)
        .eq("answered", false)
        .not("title", "like", "[archived]%")
        .order("askedTimestampMs", { ascending: true })
        .limit(1)
        .single();
    if (error) {
        logger?.error({ error }, "Could not find oldest unanswered Q&A, exiting");
        return;
    }
    logger?.info(`Starting update from Q&A ${question.id}`);
    const { questions } = await fetchQuestionsIterative({ logger, start: parseInt(question.id) });
    const success = await upsertQuestions(questions, { logger });
    if (success) {
        logger?.info(`Updated ${questions.length} questions.`);
    }
}
