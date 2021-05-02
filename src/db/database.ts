import path from "path";
import Database from "better-sqlite3"
import type { Query, QnaRow } from "../types"

export const searchDB = async (query: Query) => {
    const database = new Database(path.resolve(__dirname, "../data/qna.db"))

    const criteria = query.wholeword ? `MATCH '${query.query}'` : `LIKE '%${query.query}%'`;

    const matchingTitles: QnaRow[] = database.prepare(`SELECT * FROM QNA WHERE title ${criteria}`).all();
    const matchingQuestions: QnaRow[] = database.prepare(`SELECT * FROM QNA WHERE question ${criteria}`).all();
    const matchingAnswers: QnaRow[] = database.prepare(`SELECT * FROM QNA WHERE answer ${criteria}`).all();

    database.close();
    
    const results = [...matchingTitles, ...matchingQuestions, ...matchingAnswers];
    const uniqueResults: Array<QnaRow> = [];

    for (const res of results) {
        if (!uniqueResults.find(r => r.id === res.id))
            uniqueResults.push(res)
    }
    return uniqueResults
}