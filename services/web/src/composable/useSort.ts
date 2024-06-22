import { Question } from 'vex-qna-archiver';
import { MaybeRefOrGetter, reactive, ref, toValue, watchEffect } from 'vue';
import { Option } from "./types";
import { SortFunction, SortRule, multisortrules } from '../util/sorting';

export enum SortOptions {
    RELEVANCE,
    SEASON,
    AUTHOR,
    QUESTION_STATE,
    ASK_DATE,
    ANSWER_DATE
}

export type SortOption = Option<SortOptions> & {
    asc: boolean;
};

export const getSortOptions = (): SortOption[] => {
    return [
        {
            name: "Relevance",
            value: SortOptions.RELEVANCE,
            asc: false
        },
        {
            name: "Season",
            value: SortOptions.SEASON,
            asc: false
        },
        {
            name: "Author",
            value: SortOptions.AUTHOR,
            asc: false
        },
        {
            name: "Question State",
            value: SortOptions.QUESTION_STATE,
            asc: false
        },
        {
            name: "Ask Date",
            value: SortOptions.ASK_DATE,
            asc: false
        },
        {
            name: "Answer Date",
            value: SortOptions.ANSWER_DATE,
            asc: false
        },
    ];
}

export type AdvancedSortOption<T> = Option<Exclude<SortOptions, SortOptions.RELEVANCE>> & Omit<SortRule<T>, "sort">;

export interface SearchSortOptions {
    basic: {
        sort: Option<SortOptions>;
        asc: boolean;
    },
    advanced: AdvancedSortOption<Question>[],
    advancedEnabled: boolean;
}

export const advancedSortOptions = [
    {
        name: "Season",
        value: SortOptions.SEASON,
    },
    {
        name: "Author",
        value: SortOptions.AUTHOR,
    },
    {
        name: "Question State",
        value: SortOptions.QUESTION_STATE,
    },
    {
        name: "Ask Date",
        value: SortOptions.ASK_DATE,
    },
    {
        name: "Answer Date",
        value: SortOptions.ANSWER_DATE,
    },
]

export const basicSortOptions = [
    ...advancedSortOptions,
    {
        name: "Relevance",
        value: SortOptions.RELEVANCE,
    }
]

type SortMap<T> = {
    [K in SortOptions]: SortFunction<T>;
}

const SORT_MAP: SortMap<Question> = {
    [SortOptions.RELEVANCE]: () => 0,
    [SortOptions.SEASON]: (a, b) => parseInt(b.season.split("-")[1]) - parseInt(a.season.split("-")[1]),
    [SortOptions.AUTHOR]: (a, b) => a.author.localeCompare(b.author),
    [SortOptions.QUESTION_STATE]: (a, b) => +b.answered - +a.answered,
    [SortOptions.ASK_DATE]: (a, b) => (b.askedTimestampMs ?? 0) - (a.askedTimestampMs ?? 0),
    [SortOptions.ANSWER_DATE]: (a, b) => (b.answeredTimestampMs ?? 0) - (a.answeredTimestampMs ?? 0)
}

export const useSort = (questions: MaybeRefOrGetter<Question[]>) => {
    const getDefaultSearchSortOptions = (): SearchSortOptions => {
        return {
            basic: {
                sort: {
                    name: "Relevance",
                    value: SortOptions.RELEVANCE
                },
                asc: false
            },
            advanced: [],
            advancedEnabled: false
        }
    }

    const sortOptions = reactive(getDefaultSearchSortOptions());
    const sortedQuestions = ref<Question[]>([]);

    const doBasicSort = (questions: Question[]) => {
        const questionsCopy = [...questions];
        const sortFn = SORT_MAP[sortOptions.basic.sort.value];
        questionsCopy.sort((a, b) => {
            if (sortOptions.basic.asc) {
                return sortFn(a, b);
            }
            return sortFn(b, a);
        });
        return questionsCopy;
    }

    const doAdvancedSort = (questions: Question[]): Question[] => {
        const questionsCopy = [...questions];
        const sorts: SortRule<Question>[] = sortOptions.advanced.map(s => ({ sort: SORT_MAP[s.value], asc: s.asc }));
        return multisortrules(questionsCopy, sorts);
    }

    const applySorts = () => {
        const questionsValue = toValue(questions);
        if (sortOptions.advancedEnabled) {
            sortedQuestions.value = doAdvancedSort(questionsValue);
            return;
        }
        sortedQuestions.value = doBasicSort(questionsValue);
    }

    watchEffect(() => applySorts());

    return { sortedQuestions, sortOptions }
}
