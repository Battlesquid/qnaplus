import Dexie, { EntityTable } from "dexie";
import { Question } from "vex-qna-archiver";

const BUCKET = "qnaplus"
const DATA_URL = `https://ogswwijdqskurrdkbnii.supabase.co/storage/v1/object/public/${BUCKET}/questions.json`;
const DATA_PRIMARY_KEY = "0";

export interface QnaplusAppData {
    id: string;
    seasons: string[];
    programs: string[];
}

export interface QnaplusMetadata {
    id: string;
    lastUpdated: number;
}

interface QnaplusDatabase extends Dexie {
    questions: EntityTable<Question, "id">;
    metadata: EntityTable<QnaplusMetadata, "id">;
    appdata: EntityTable<QnaplusAppData, "id">;
}

export const database = new Dexie("qnaplus", { autoOpen: true }) as QnaplusDatabase;

database.version(1).stores({
    questions: "id",
    metadata: "id",
    appdata: "id"
});

const populateQuestions = async (db: QnaplusDatabase) => {
    const response = await fetch(DATA_URL);
    if (response.status !== 200) {
        console.error(response.status, response.statusText)
        return; // TODO: handle
    }
    const questions = await response.json() as Question[];
    await db.questions.bulkPut(questions);

    const lastUpdated = Date.now();
    await db.metadata.put({ id: DATA_PRIMARY_KEY, lastUpdated });

    const seasons = questions
        .map(q => q.season)
        .sort((a, b) => parseInt(b.split("-")[1]) - parseInt(a.split("-")[1]))
        .filter((season, index, array) => array.indexOf(season) === index)
    // .map(season => ({ name: season, value: season }));
    const programs = questions
        .map(q => q.program)
        .filter((program, index, array) => array.indexOf(program) === index);
    await db.appdata.put({ id: DATA_PRIMARY_KEY, seasons, programs });
}

export const getDatabaseReady = async () => {
    database.open().catch(function (e) {
        console.error("Open failed: " + e.stack);
    });
    return new Promise<void>((resolve, _reject) => {
        database.on("ready", async (_db) => {
            const db = _db as QnaplusDatabase;
            const count = await db.questions.count();
            if (count === 0) {
                await populateQuestions(db);
            }
            resolve();
        });
    })
}

export const getMetadata = () => {
    return database.metadata.get(DATA_PRIMARY_KEY);
}

export const getAppData = async () => {
    const data = await database.appdata.get(DATA_PRIMARY_KEY);
    if (data === undefined) {
        // TODO: replace with better logging
        console.warn("warning, app data is undefined");
    }
    return data;
}
