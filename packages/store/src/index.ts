import pino from "pino"
import { getAllQuestions } from "vex-qna-archiver"
import { addDocuments } from "./database";

const logger = pino();

export const populateDatabase = async () => {
    const questions = await getAllQuestions(logger);
    return addDocuments(questions, {
        collectionName: q => q.program,
        documentName: q => q.id
    });
}


