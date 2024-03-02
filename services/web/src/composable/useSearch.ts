import { useSearchFilter } from './useSearchFilter';
import { useFuse } from "@vueuse/integrations";
import data from "../data.json";
import { Constants, Question } from "vex-qna-archiver";

const questions = data as Question[];

export const useSearch = (query: string) => {
    const { results } = useFuse<Question>(query, questions, {
        fuseOptions: {
            keys: Constants.QUESTION_PROPERTIES,
            isCaseSensitive: false
        },
        matchAllWhenSearchEmpty: true
    });
    return useSearchFilter(results.value.map(r => r.item))   
}