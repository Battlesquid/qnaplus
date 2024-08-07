import { config } from "@qnaplus/config";
import { createClient } from "@supabase/supabase-js";
import { Logger } from "pino";
import { Question, getAllQuestions as archiverGetAllQuestions, fetchCurrentSeason, getOldestQuestion, getOldestUnansweredQuestion } from "vex-qna-archiver";
import { ChangeQuestion, classifyChanges } from "./change_classifier";
import { PayloadQueue, RenotifyPayload, UpdatePayload } from "./payload_queue";
import { QnaplusChannels, QnaplusEvents, QnaplusTables, asEnvironmentResource } from "./resources";
import { Database } from "./supabase";

const supabase = createClient<Database>(config.getenv("SUPABASE_URL"), config.getenv("SUPABASE_KEY"))
const METADATA_ROW_ID = 0;

export type StoreOptions = {
    logger?: Logger;
}

export const getSupabaseInstance = () => {
    return supabase;
}

export const populate = async (logger?: Logger) => {
    const { questions } = await archiverGetAllQuestions(logger);
    return insertQuestions(questions, { logger });
}

export const populateWithMetadata = async (logger?: Logger) => {
    const { questions } = await archiverGetAllQuestions(logger);
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
        .from(asEnvironmentResource(QnaplusTables.Metadata))
        .upsert({ id: METADATA_ROW_ID, current_season: currentSeason, oldest_unanswered_question: oldestQuestionId });

    if (error) {
        logger?.error({ error }, "Unable to populate question metadata");
    } else {
        logger?.info({ oldest_question_id: oldestQuestionId, current_season: currentSeason }, "Successfully populated metadata")
    }
}

export const getQuestion = async (id: Question["id"], opts?: StoreOptions): Promise<Question | null> => {
    const logger = opts?.logger?.child({ label: "getDocument" });
    const row = await supabase.from(asEnvironmentResource(QnaplusTables.Questions)).select().eq("id", id).single();
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
            .from(asEnvironmentResource(QnaplusTables.Questions))
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
    const { error, status } = await supabase.from(asEnvironmentResource(QnaplusTables.Questions)).insert(data);
    logger?.trace({ error, status });
}

export const insertQuestions = async (data: Question[], opts?: StoreOptions) => {
    const logger = opts?.logger?.child({ label: "insertQuestions" });
    const { error, status } = await supabase.from(asEnvironmentResource(QnaplusTables.Questions)).insert(data);
    logger?.trace({ error, status });
}

export const upsertQuestions = async (data: Question[], opts?: StoreOptions) => {
    const logger = opts?.logger?.child({ label: "upsertQuestions" });
    logger?.info(`Upserting ${data.length} questions`)
    const { error, status } = await supabase.from(asEnvironmentResource(QnaplusTables.Questions)).upsert(data, { ignoreDuplicates: false });
    if (error !== null) {
        logger?.warn({ error, status })
    }
    return error === null;
}

export const getMetadata = async () => {
    return await supabase.from(asEnvironmentResource(QnaplusTables.Metadata))
        .select("*")
        .eq("id", METADATA_ROW_ID)
        .single();
}

// TODO add better typing
export const saveMetadata = async (metadata: object) => {
    return await supabase.from(asEnvironmentResource(QnaplusTables.Metadata))
        .upsert({ id: METADATA_ROW_ID, ...metadata });
}
export const getRenotifyQueue = async () => {
    return await supabase.from(asEnvironmentResource(QnaplusTables.RenotifyQueue))
        .select(`*, ..."${asEnvironmentResource(QnaplusTables.Questions)}" (*)`)
        .returns<Question[]>(); // TODO remove once spread is fixed (https://github.com/supabase/postgrest-js/pull/531)
}

export type ChangeCallback = (items: ChangeQuestion[]) => void | Promise<void>;

export const onChange = (callback: ChangeCallback, logger?: Logger) => {
    const queue = new PayloadQueue<UpdatePayload<Question>>({
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
        .channel(asEnvironmentResource(QnaplusChannels.DbChanges))
        .on<Question>(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: asEnvironmentResource(QnaplusTables.Questions),
            },
            payload => queue.push({ old: payload.old, new: payload.new })
        )
        .on<RenotifyPayload>(
            "broadcast",
            { event: QnaplusEvents.RenotifyQueueFlush },
            async ({ payload }) => {
                const { questions } = payload;
                const items = questions.map<UpdatePayload<Question>>(p => ({ old: { ...p, answered: false }, new: p }));
                queue.push(...items);
                const result = await supabase
                    .channel(asEnvironmentResource(QnaplusChannels.RenotifyQueue))
                    .send({
                        type: "broadcast",
                        event: QnaplusEvents.RenotifyQueueFlushAck,
                        payload: {}
                    });
                logger?.info(`Sent renotify queue acknowledgement with result '${result}'`);
            }
        )
        .subscribe();
}
