import { Logger } from "pino";
import { getAllQuestions } from "vex-qna-archiver";
import { insertQuestions } from "./database";

export const populateDatabase = async (logger?: Logger) => {
    const questions = await getAllQuestions(logger);
    return insertQuestions(questions, { logger });
}

export * from "./database";
