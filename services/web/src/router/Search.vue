<script setup lang="ts">
import { useObservable } from "@vueuse/rxjs";
import { liveQuery } from "dexie";
import { from } from "rxjs";
import { Question } from "vex-qna-archiver";
import { Ref, inject, ref } from "vue";
import QuestionList from "../components/QuestionList.vue";
import QuestionListHeader from "../components/QuestionListHeader.vue";
import SearchInput from "../components/SearchInput.vue";
import SearchOptions from "../components/SearchOptions.vue";
import { useSearch } from "../composable/useSearch";
import { useSearchFilter } from "../composable/useSearchFilter";
import { useSort } from "../composable/useSort";
import { QnaplusAppData, database } from "../database";
import Root from "./Root.vue";

const query = ref("");
const dbQuestions = useObservable<Question[], Question[]>(from(liveQuery(() => database.questions.toArray())), {
    initialValue: []
});
const appData = inject<Ref<QnaplusAppData | undefined>>("appdata")!;
const { questions } = useSearch(query, dbQuestions);
const { filteredQuestions, ...filterOptions } = useSearchFilter(questions, {
    programs: appData.value?.programs ?? [],
    seasons: appData.value?.seasons ?? []
});
const { sortedQuestions, sortOptions } = useSort(filteredQuestions)


</script>

<template>
    <Root>
        <div class="h-full flex flex-column gap-2 p-3">
            <div class="flex flex-column gap-2">
                <QuestionListHeader :results="sortedQuestions.length" />
                <SearchInput class="flex-1" v-model="query" />
                <SearchOptions :filter-options="filterOptions" :sort-options="sortOptions" />
            </div>
            <div class="h-full flex flex-column gap-2">
                <QuestionList :questions="sortedQuestions" />
            </div>
        </div>
    </Root>
</template>

<style></style>