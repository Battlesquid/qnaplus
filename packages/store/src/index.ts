import { Logger } from "pino";
import { Program, Question, getAllQuestions, getQuestions } from "vex-qna-archiver";
import { addDocuments, getDocument, onModified } from "./database";


export const populateDatabase = async (logger?: Logger) => {
    const questions = await getAllQuestions(logger);
    return addDocuments(questions, {
        collectionName: q => q.program,
        documentName: q => q.id
    });
}

export const updateQuestions = async (logger?: Logger) => {
    const questions = await getQuestions(undefined, logger);
    return addDocuments(questions, {
        collectionName: q => q.program,
        documentName: q => q.id
    });
}

export const getQuestion = async (program: Program, id: Question["id"], logger?: Logger) => {
    return getDocument(program, id, { logger });
}

export const onAnswered = (callback: (docs: Question[]) => void) => {
    return onModified("questions", "answered", "==", "false", {
        callback,
        condition: q => q.answer === "true"
    });
}
