import { Question } from 'vex-qna-archiver';
import { MaybeRefOrGetter, Ref, reactive, ref, toValue, watchEffect } from 'vue';
import { questions } from '../database';

export type Option<T> = {
    name: string;
    value: T;
}

export type SearchFilters = {
    season: Option<Question["season"]>[];
    program: Option<Question["program"]>[];
    author: Question["author"] | null;
    state: Option<QuestionStateValue>;
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

export const questionStates: Option<QuestionStateValue>[] = [
    { name: "All", value: QuestionStateValue.All },
    { name: 'Answered', value: QuestionStateValue.Answered },
    { name: 'Unanswered', value: QuestionStateValue.Unanswered }
]

export const seasons: Option<string>[] = questions.value
    .map(q => q.season)
    .sort((a, b) => parseInt(b.split("-")[1]) - parseInt(a.split("-")[1]))
    .filter((season, index, array) => array.indexOf(season) === index)
    .map(season => ({ name: season, value: season }));

console.log(seasons);

export const programs: Option<string>[] = questions.value
    .map(q => q.program)
    .filter((program, index, array) => array.indexOf(program) === index)
    .map(program => ({ name: program, value: program }));

type FilterMap = {
    [K in keyof SearchFilters]: (question: Question, filters: SearchFilters) => boolean;
}

const FILTER_MAP: FilterMap = {
    season(q, f) {
        return f.season.find(s => s.value === q.season) !== undefined;
    },
    program(q, f) {
        return f.program.find(p => p.value === q.program) !== undefined;
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
        return f.tags.every(t => q.tags.includes(t));
    }
}

const getInitialFilterState = () => {
    return {
        season: [seasons[0]],
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
        filteredQuestions.value = value.filter(q => applicableFilters.every(f => f(q, filters)));
    }

    watchEffect(() => applyFilters());

    return { filters, filteredQuestions, clearFilters };
}
