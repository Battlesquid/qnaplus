import config from "@qnaplus/config";
import { RealtimePostgresUpdatePayload, createClient } from "@supabase/supabase-js";
import { Logger } from "pino";
import { Question } from "vex-qna-archiver";
import { PayloadQueue, PayloadQueueFlushCallback } from "./payload_queue";
import { Database } from "./supabase";

const supabase = createClient<Database>(config.getenv("SUPABASE_URL"), config.getenv("SUPABASE_KEY"))

type Options = {
    logger?: Logger;
}

export const getQuestion = async (id: Question["id"], opts?: Options): Promise<Question | null> => {
    const logger = opts?.logger?.child({ label: "getDocument" });
    const row = await supabase.from("questions").select().eq("id", id).single();
    if (row.error === null) {
        logger?.trace(`No question with id '${id}' found.`);
    }
    return row.data;
}

export const insertQuestion = async (data: Question, opts?: Options) => {
    const logger = opts?.logger?.child({ label: "insertQuestion" });
    const { error, status } = await supabase.from("questions").insert(data);
    logger?.trace({ error, status });
}

export const insertQuestions = async (data: Question[], opts?: Options) => {
    const logger = opts?.logger?.child({ label: "insertQuestions" });
    const { error, status } = await supabase.from("questions").insert(data);
    logger?.trace({ error, status });
}

const CHANGE_EVENTS = ["answered", "question_edited", "answer_edited"] as const;

export type ChangeEvent = typeof CHANGE_EVENTS[number];

export type ChangeCondition<T> = (newItem: T, oldItem: Partial<T>) => boolean;

type ChangeMap<T> = {
    conditions: {
        [P in ChangeEvent]: ChangeCondition<T>;
    },
    formatters: {
        [P in ChangeEvent]: (newItem: T, oldItem: Partial<T>) => Question;
    }
}

// const CHANGE_MAP: Record<ChangeEvent, ChangeCondition<Question>> = {
//     answered(newItem, oldItem) {
//         return (oldItem?.answer === newItem.answer || oldItem?.question === oldItem?.question) && oldItem?.answered !== newItem.answered;
//     },
//     answer_edited(newItem, oldItem) {
//         return !this.answered(newItem, oldItem) && oldItem?.answer !== newItem.answer;
//     },
//     question_edited(newItem, oldItem) {
//         return !this.answered(newItem, oldItem) && oldItem?.question !== newItem.question;
//     }
// }

type EditedQuestion = Question & {
    old: string;
    new: string;
}

const CHANGE_MAP: ChangeMap<Question> = {
    conditions: {
        answered(newItem, oldItem) {
            return (oldItem?.answer === newItem.answer || oldItem?.question === oldItem?.question) && oldItem?.answered !== newItem.answered;
        },
        answer_edited(newItem, oldItem) {
            return !this.answered(newItem, oldItem) && oldItem?.answer !== newItem.answer;
        },
        question_edited(newItem, oldItem) {
            return !this.answered(newItem, oldItem) && oldItem?.question !== newItem.question;
        },
    },
    formatters: {
        answered(newItem, oldItem): Question {
            return newItem
        },
        question_edited(newItem, oldItem): EditedQuestion {
            throw new Error("Function not implemented.");
        },
        answer_edited(newItem, oldItem) {
            throw new Error("Function not implemented.");
        }
    }
}

const partitionChanges = (items: RealtimePostgresUpdatePayload<Question>[]) => {
    const changes: Record<ChangeEvent, Question[]> = {
        answered: [],
        answer_edited: [],
        question_edited: []
    }
    for (const { old: oldQuestion, new: newQuestion } of items) {
        for (const event of CHANGE_EVENTS) {
            if (CHANGE_MAP.conditions[event](newQuestion, oldQuestion)) {
                changes[event].push(CHANGE_MAP.formatters[event](newQuestion, oldQuestion))
            }
        }
    }
    return changes;
}

export type OnChangeOptions = {
    [K in ChangeEvent]?: PayloadQueueFlushCallback<Question>;
}

export const onChange = (options: OnChangeOptions) => {
    const queue = new PayloadQueue<RealtimePostgresUpdatePayload<Question>>({
        onFlush(items) {
            const { answered, answer_edited, question_edited } = partitionChanges(items);

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

// export type OnChangeOptions<T extends DocumentData> = {
//     collectionName: string;
//     where: {
//         field: keyof T;
//         op: WhereFilterOp;
//         value: unknown;
//     }
//     event: DocumentChangeType;
//     ignoreInitial?: boolean;
//     logger?: Logger;
//     condition?: (doc: T) => boolean;
//     callback: (docs: T[]) => void
// }

// const DEFAULT_MODIFIED_OPTIONS_CONDITION: OnChangeOptions<DocumentData>["condition"] = () => true;

// export const onChange = <T extends DocumentData>(options: OnChangeOptions<T>) => {
//     const { collectionName, where: { field, op, value }, event, ignoreInitial, logger } = options;
//     let initialized = false;
//     const condition = options.condition ?? DEFAULT_MODIFIED_OPTIONS_CONDITION;
//     const callback = options.callback;
//     const q = query(collection(firestore, collectionName), where(field as string, op, value));
//     return onSnapshot(q, snapshot => {
//         if (ignoreInitial && !initialized) {
//             logger?.trace("Skipping initial snapshot event");
//             initialized = true;
//             return;
//         }
//         const changes = categorize(snapshot.docChanges().map(c => c.type))
//             .map(c => `${c.count} ${c.value}`)
//             .join();
//         logger?.trace(`${snapshot.docChanges().length} changes occurred on ${collectionName}`);
//         logger?.trace(changes);
//         const modified = snapshot.docChanges()
//             .filter(change => change.type === event && condition(change.doc.data() as T))
//             .map(change => change.doc.data() as T);
//         callback(modified);
//     });
// }
