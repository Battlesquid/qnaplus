import MiniSearch, { SearchResult } from "minisearch";
import { Question } from "vex-qna-archiver";
import { MaybeRefOrGetter, ref, toValue, watchEffect } from 'vue';
import data from "../data.json";
import { isEmpty } from "../util/strings";

type QuestionSearchResult = Question & SearchResult;

export const allQuestions = data as Question[];

const minisearch = new MiniSearch<Question>({
    fields: ["title", "question", "answer"],
    storeFields: [
        "id",
        "url",
        "author",
        "program",
        "title",
        "question",
        "questionRaw",
        "answer",
        "answerRaw",
        "season",
        "askedTimestamp",
        "askedTimestampMs",
        "answeredTimestamp",
        "answeredTimestampMs",
        "answered",
        "tags"
    ]
});

export const useLoadResources = () => {
    const loading = ref<boolean>(true);
    minisearch.addAllAsync(allQuestions)
        .finally(() => loading.value = false);
    return { loading };
}

export const useSearch = (query: MaybeRefOrGetter<string>) => {
    const questions = ref<Question[]>([]);

    const search = () => {
        const value = toValue(query);
        if (isEmpty(value)) {
            questions.value = allQuestions;
        } else {
            const results = minisearch.search(value, { fuzzy: 0.2 }) as QuestionSearchResult[];
            questions.value = results;
        }
    }

    watchEffect(() => search());

    return { questions };
}