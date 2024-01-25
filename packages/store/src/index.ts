import { Logger } from "pino";
import { Question, getAllQuestions } from "vex-qna-archiver";
import { insertQuestions, onChange } from "./database";


export const populateDatabase = async (logger?: Logger) => {
    const questions = await getAllQuestions(logger);
    return insertQuestions(questions, { logger });
}

export const updateQuestions = async (logger?: Logger) => {
    // const questions = await getQuestions(undefined, logger);
    // return addRows(questions, {
    //     collectionName: _ => "questions",
    //     documentName: q => q.id
    // });
}

export { onChange };
export const onAnswered = async (callback: (docs: Question[]) => void, ignoreInitial?: boolean, logger?: Logger) => {
    // const season = await fetchCurrentSeason();
    // return onChange<Question>({
    //     collectionName: "questions",
    //     where: {
    //         field: "season",
    //         op: "==",
    //         value: season,
    //     },
    //     event: "modified",
    //     ignoreInitial,
    //     condition: q => q.answered,
    //     callback,
    //     logger
    // });
}

(async () => {
    onChange({
        answered(items) {

        },
        answer_edited(items) {
            
        }
    });
    console.log("started")
})();
