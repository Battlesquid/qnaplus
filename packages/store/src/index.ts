import { Logger } from "pino";
import { Program, Question, fetchCurrentSeason, getAllQuestions, getQuestions } from "vex-qna-archiver";
import { addDocuments, getDocument, onChange } from "./database";


export const populateDatabase = async (logger?: Logger) => {
    const questions = await getAllQuestions(logger);
    return addDocuments(questions, {
        collectionName: _ => "questions",
        documentName: q => q.id
    });
}

export const updateQuestions = async (logger?: Logger) => {
    const questions = await getQuestions(undefined, logger);
    return addDocuments(questions, {
        collectionName: _ => "questions",
        documentName: q => q.id
    });
}

export const getQuestion = async (program: Program, id: Question["id"], logger?: Logger) => {
    return getDocument(program, id, { logger });
}

export const onAnswered = async (callback: (docs: Question[]) => void, ignoreInitial?: boolean, logger?: Logger) => {
    const season = await fetchCurrentSeason();
    return onChange<Question>({
        collectionName: "questions",
        where: {
            field: "season",
            op: "==",
            value: season,
        },
        event: "modified",
        ignoreInitial,
        condition: q => q.answered,
        callback,
        logger
    });
}
