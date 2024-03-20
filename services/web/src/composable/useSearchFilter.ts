import { Question } from 'vex-qna-archiver';
import { MaybeRefOrGetter, Ref, reactive, ref, toValue, watchEffect } from 'vue';

export type QuestionState = {
    name: string,
    value: QuestionStateValue
}

export type SearchFilters = {
    season: Question["season"][];
    program: Question["program"][];
    author: Question["author"] | null;
    state: QuestionState;
    askedBefore: Date | null;
    askedAfter: Date | null;
    answeredBefore: Date | null;
    answeredAfter: Date | null;
    tags: string[];
}

export enum QuestionStateValue {
    All,
    Answered,
    Unanswered
}

export const questionStates: QuestionState[] = [
    { name: "All", value: QuestionStateValue.All },
    { name: 'Answered', value: QuestionStateValue.Answered },
    { name: 'Unanswered', value: QuestionStateValue.Unanswered }
]

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
        return q.author.startsWith(f.author ?? "");
    },
    state(q, f) {
        if (f.state.value === QuestionStateValue.All) {
            return true;
        }
        return f.state.value === QuestionStateValue.Answered ? q.answered : !q.answered;
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
            value: QuestionStateValue.All
        },
        askedBefore: null,
        askedAfter: null,
        answeredBefore: null,
        answeredAfter: null,
        tags: []
    };
}

const isEmptyFilterValue = (filterValue: SearchFilters[keyof SearchFilters]): boolean => {
    if (typeof filterValue === "string") {
        return filterValue.trim() === "";
    } else if (Array.isArray(filterValue)) {
        return filterValue.length === 0;
    }
    return filterValue === null;
}

export type SearchFilterComposable = {
    filters: SearchFilters;
    filteredQuestions: Ref<Question[]>;
    clearFilters(): void;
}

export const useSearchFilter = (questions: MaybeRefOrGetter<Question[]>): SearchFilterComposable => {
    const clearFilters = () => {
        Object.assign(filters, getInitialFilterState());
    }

    const filters = reactive<SearchFilters>(getInitialFilterState());
    const filteredQuestions = ref<Question[]>([]);

    const applyFilters = () => {
        const value = toValue(questions);
        const keys = Object.keys(filters) as Array<keyof SearchFilters>;
        const applicableFilters = keys
            .filter(k => !isEmptyFilterValue(filters[k]))
            .map(k => FILTER_MAP[k]);

        console.log(applicableFilters);
        filteredQuestions.value = value.filter(q => applicableFilters.every(f => f(q, filters)));
    }

    watchEffect(() => applyFilters());

    return { filters, filteredQuestions, clearFilters };
}
