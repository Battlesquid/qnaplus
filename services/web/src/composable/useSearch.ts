import MiniSearch, { SearchResult } from "minisearch";
import { Question } from "vex-qna-archiver";
import { MaybeRefOrGetter, ref, toValue, watchEffect } from 'vue';
import { questions as dbQuestions } from "../database";
import { isEmpty } from "../util/strings";

type QuestionSearchResult = Question & SearchResult;

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

export const loadSearchResources = () => {
    const loading = ref<boolean>(true);
    minisearch.addAllAsync(dbQuestions.value)
        .finally(() => loading.value = false);
    return { loading };
}

export const useSearch = (query: MaybeRefOrGetter<string>) => {
    const questions = ref<Question[]>([]);

    const search = () => {
        const value = toValue(query);
        if (isEmpty(value)) {
            questions.value = dbQuestions.value;
        } else {
            const results = minisearch.search(value, { fuzzy: 0.5 }) as QuestionSearchResult[];
            questions.value = results;
        }
    }

    watchEffect(() => search());

    return { questions };
}