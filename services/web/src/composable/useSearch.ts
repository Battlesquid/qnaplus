import MiniSearch, { SearchResult } from "minisearch";
import { Question } from "vex-qna-archiver";
import { MaybeRefOrGetter, ref, toValue, watchEffect } from 'vue';
import data from "../data.json";

type QuestionSearchResult = Question & SearchResult;

const allQuestions = data as Question[];

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

minisearch.addAll(allQuestions);

export const useSearch = (query: MaybeRefOrGetter) => {
    const questions = ref<Question[]>([]);

    // const filteredQuestions = useSearchFilter(allQuestions);
    const search = () => {
        const value = toValue(query);
        const results = minisearch.search(value) as QuestionSearchResult[];
        questions.value = results;
    }

    watchEffect(() => {
        search();
    });

    return { questions };
}