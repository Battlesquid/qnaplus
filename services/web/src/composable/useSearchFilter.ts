import { Question } from 'vex-qna-archiver';
import { reactive } from 'vue';

export type SearchFilters = {
    season: Question["season"][];
    program: Question["program"][];
    author: Question["author"] | null;
    state: {
        name: string,
        value: QuestionState
    };
    askedBefore: Date | null;
    askedAfter: Date | null;
    answeredBefore: Date | null;
    answeredAfter: Date | null;
    tags: string[];
}

export enum QuestionState {
    All,
    Answered,
    Unanswered
}

type FilterMap = {
    [K in keyof SearchFilters]: (question: Question, filters: SearchFilters) => boolean;
}

const FILTER_MAP: FilterMap = {
    season(q, f) {
        return f.season?.includes(q.season) ?? false;
    },
    program(q, f) {
        return f.program?.includes(q.program) ?? false;
    },
    author(q, f) {
        return q.author === f.author;
    },
    state(q, f) {
        if (f.state.value === QuestionState.All) {
            return true;
        }
        return f.state.value === QuestionState.Answered ? q.answered : !q.answered;
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

const getInitialFilterState = () => {
    return {
        season: [],
        program: [],
        author: null,
        state: {
            name: "All",
            value: QuestionState.All
        },
        askedBefore: null,
        askedAfter: null,
        answeredBefore: null,
        answeredAfter: null,
        tags: []
    };
}

export const clearFilters = () => {
    Object.assign(filters, getInitialFilterState());
}

export const useSearchFilter = (questions: Question[], filters: SearchFilters) => {
    const keys = Object.keys(filters) as Array<keyof SearchFilters>;
    const applicableFilters = keys
        .filter(k => filters[k] !== undefined && filters[k] !== null)
        .map(k => FILTER_MAP[k]);
    return questions.filter(q => applicableFilters.every(f => f(q, filters)))
}

export const filters = reactive<SearchFilters>(getInitialFilterState());
