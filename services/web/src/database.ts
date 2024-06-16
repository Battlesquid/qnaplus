import { Awaitable } from "@vueuse/core";
import { useObservable } from "@vueuse/rxjs";
import Dexie, { EntityTable, liveQuery } from "dexie";
import { from } from "rxjs";
import { Question } from "vex-qna-archiver";

const BUCKET = "qnaplus"
const DATA_URL = `https://ogswwijdqskurrdkbnii.supabase.co/storage/v1/object/public/${BUCKET}/questions.json`;

interface QnaplusDatabase extends Dexie {
    questions: EntityTable<Question, "id">;
}

export const database = new Dexie("qnaplus") as QnaplusDatabase;

const populateQuestions = async (db: QnaplusDatabase) => {
    const response = await fetch(DATA_URL);
    if (response.status !== 200) {
        return; // TODO: handle
    }
    const json = await response.json();
    db.table("questions").bulkAdd(json);
}

database.version(1).stores({
    questions: "id",
    metadata: "id"
});

export const onDatabaseReady = (callback: () => Awaitable<void>) => {
    database.on("ready", async (_db) => {
        const db = _db as QnaplusDatabase;
        const count = await db.questions.count();
        if (count === 0) {
            populateQuestions(db);
        }
        callback();
    });
}

export const questions = useObservable<Question[], []>(from(liveQuery(() => database.questions.toArray())), {
    initialValue: []
});
