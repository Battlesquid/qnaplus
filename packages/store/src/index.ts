import pino, { Logger } from "pino"
import { getAllQuestions, getQuestions } from "vex-qna-archiver"
import { addDocuments } from "./database";

const logger = pino();

export const populateDatabase = async () => {
    const questions = await getAllQuestions(logger);
    return addDocuments(questions, {
        collectionName: q => q.program,
        documentName: q => q.id
    });
}

export const updateQuestions = async (logger?: Logger) => {
    const questions = await getQuestions(undefined, logger);
    addDocuments(questions, {
        collectionName: q => q.program,
        documentName: q => q.id
    });
}
