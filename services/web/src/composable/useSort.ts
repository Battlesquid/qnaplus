import { Question } from 'vex-qna-archiver';
import { MaybeRefOrGetter, reactive, ref, toValue, watchEffect } from 'vue';
import { Option } from "./types";
import { SortFunction, SortRule, multisortrules } from '../util/sorting';

export enum SortOptions {
    Season,
    Author,
    QuestionState,
    AskDate,
    AnswerDate
}

export enum SortOrder {
    Ascending,
    Descending
}

export type SortOption = Option<SortOptions> & {
    asc: boolean;
};

export type AdvancedSortOption<T> = Option<SortOptions> & Omit<SortRule<T>, "sort">;

export interface SearchSortOptions {
    basic: {
        sort: Option<SortOptions>;
        asc: Option<SortOrder>;
    },
    advanced: AdvancedSortOption<Question>[],
    advancedEnabled: boolean;
}

type SortMap<T> = {
    [K in SortOptions]: SortFunction<T>;
}

const SORT_MAP: SortMap<Question> = {
    [SortOptions.Season]: (a, b) => parseInt(b.season.split("-")[1]) - parseInt(a.season.split("-")[1]),
    [SortOptions.Author]: (a, b) => b.author.localeCompare(a.author),
    [SortOptions.QuestionState]: (a, b) => +b.answered - +a.answered,
    [SortOptions.AskDate]: (a, b) => (b.askedTimestampMs ?? 0) - (a.askedTimestampMs ?? 0),
    [SortOptions.AnswerDate]: (a, b) => (b.answeredTimestampMs ?? 0) - (a.answeredTimestampMs ?? 0)
}

export const sortOrderList: Option<SortOrder>[] = [
    {
        name: "Ascending",
        value: SortOrder.Ascending
    },
    {
        name: "Descending",
        value: SortOrder.Descending
    },
]

export const sortOptionsList = [
    {
        name: "Ask Date",
        value: SortOptions.AskDate,
    },
    {
        name: "Answer Date",
        value: SortOptions.AnswerDate,
    },
    {
        name: "Season",
        value: SortOptions.Season,
    },
    {
        name: "Author",
        value: SortOptions.Author,
    },
    {
        name: "Question State",
        value: SortOptions.QuestionState,
    }
];

export const useSort = (questions: MaybeRefOrGetter<Question[]>) => {
    const getDefaultSearchSortOptions = (): SearchSortOptions => {
        return {
            basic: {
                sort: {
                    name: "Ask Date",
                    value: SortOptions.AskDate,
                },
                asc: {
                    name: "Ascending",
                    value: SortOrder.Ascending
                },
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
            if (sortOptions.basic.asc.value === SortOrder.Ascending) {
                return sortFn(b, a);
            }
            return sortFn(a, b);
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
