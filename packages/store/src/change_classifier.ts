import { Change, diffSentences } from "diff";
import { Question } from "@qnaplus/scraper";
import { UpdatePayload } from "./payload_queue";

const CHANGE_EVENTS = ["answered", "answer_edited"] as const;

export type ChangeEvent = typeof CHANGE_EVENTS[number];
export type ChangeCondition<T> = (newItem: T, oldItem: Partial<T>) => boolean;
export type ChangeHandler<T, U> = (newItem: T, oldItem: Partial<T>) => U;

export type ChangeQuestion = AnsweredQuestion | AnswerEditedQuestion;

export interface AnsweredQuestion extends Question {
    changeType: "answered";
}

export interface AnswerEditedQuestion extends Question {
    changeType: "answer_edited";
    diff: Change[];
}

type ChangeMap<T> = {
    [P in ChangeEvent]: {
        matches: ChangeCondition<T>;
        format: ChangeHandler<T, ChangeTypeMap[P]>;
    }
}

export type ChangeTypeMap = {
    answered: AnsweredQuestion;
    answer_edited: AnswerEditedQuestion;
}

const CHANGE_MAP: ChangeMap<Question> = {
    answered: {
        matches(newItem, oldItem) {
            return oldItem.answered === false
                && newItem.answered;
        },
        format(newItem, _) {
            return { ...newItem, changeType: "answered" };
        }
    },
    answer_edited: {
        matches(newItem, oldItem) {
            return Boolean(oldItem.answer)
                && Boolean(newItem.answer)
                && oldItem.answer !== newItem.answer;
        },
        format(newItem, oldItem) {
            // based on the above condition, we can safely use non-null assertion
            const diff = diffSentences(oldItem.answer!, newItem.answer!);
            return { ...newItem, changeType: "answer_edited", diff };
        }
    }
}

export const classifyChanges = (items: UpdatePayload<Question>[]) => {
    const changes: ChangeQuestion[] = [];
    for (const { old: oldQuestion, new: newQuestion } of items) {
        for (const event of CHANGE_EVENTS) {
            if (CHANGE_MAP[event].matches(newQuestion, oldQuestion)) {
                changes.push(CHANGE_MAP[event].format(newQuestion, oldQuestion));
            }
        }
    }
    return changes;
}