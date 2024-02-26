import { Question } from 'vex-qna-archiver';

export type SearchFilters = {
    season: Question["season"];
    program: Question["program"];
    author: Question["author"];
    state: QuestionState;
    askedBefore: Date;
    askedAfter: Date;
    answeredBefore: Date;
    answeredAfter: Date;
    tags: string[];
}

enum QuestionState {
    All,
    Answered,
    Unanswered
}

type FilterMap = {
    [K in keyof SearchFilters]: (question: Question, filters: Partial<SearchFilters>) => boolean;
}

const FILTER_MAP: FilterMap = {
    season(q, f) {
        return q.season === f.season;
    },
    program(q, f) {
        return q.program === f.program;
    },
    author(q, f) {
        return q.author === f.author;
    },
    state(q, f) {
        if (f.state === QuestionState.All) {
            return true;
        }
        return f.state === QuestionState.Answered ? q.answered : !q.answered;
    },
    askedBefore(q, f) {
        if (q.askedTimestampMs === null) {
            return false;
        }
        return new Date(q.askedTimestampMs) < f.askedBefore!;
    },
    askedAfter(q, f) {
        if (q.askedTimestampMs === null) {
            return false;
        }
        return new Date(q.askedTimestampMs) > f.askedAfter!;
    },
    answeredBefore(q, f) {
        if (q.askedTimestampMs === null) {
            return false;
        }
        return new Date(q.askedTimestampMs) < f.answeredBefore!;
    },
    answeredAfter(q, f) {
        if (q.askedTimestampMs === null) {
            return false;
        }
        return new Date(q.askedTimestampMs) > f.answeredAfter!;
    },
    tags(q, f) {
        return f.tags!.every(t => q.tags.includes(t));
    }
}

export const useSearchFilter = (questions: Question[], filters: Partial<SearchFilters>) => {
    const keys = Object.keys(filters) as Array<keyof SearchFilters>;
    const applicableFilters = keys
        .filter(k => filters[k] !== undefined && filters[k] !== null)
        .map(k => FILTER_MAP[k]);
    return questions.filter(q => applicableFilters.every(f => f(q, filters)))
}
