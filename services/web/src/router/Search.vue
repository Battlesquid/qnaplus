<script setup lang="ts">
import { useObservable } from "@vueuse/rxjs";
import { liveQuery } from "dexie";
import { from } from "rxjs";
import { Question } from "vex-qna-archiver";
import { Ref, inject, ref } from "vue";
import AdvancedSearch from "../components/AdvancedSearch.vue";
import QuestionList from "../components/QuestionList.vue";
import QuestionListHeader from "../components/QuestionListHeader.vue";
import SearchInput from "../components/SearchInput.vue";
import { useSearch } from "../composable/useSearch";
import { useSearchFilter } from "../composable/useSearchFilter";
import { QnaplusAppData, database } from "../database";
import Root from "./Root.vue";

const query = ref("");
const dbQuestions = useObservable<Question[], Question[]>(from(liveQuery(() => database.questions.toArray())), {
    initialValue: []
});
const appData = inject<Ref<QnaplusAppData | undefined>>("appdata")!;
const { questions } = useSearch(query, dbQuestions);
const { filteredQuestions, filters, clearFilters, seasons, programs, appliedFilterCount } = useSearchFilter(questions, {
    programs: appData.value?.programs ?? [],
    seasons: appData.value?.seasons ?? []
});

</script>

<template>
    <Root>
        <div class="h-full flex flex-column gap-2 p-3">
            <div class="flex flex-column gap-2">
                <SearchInput class="flex-1" v-model="query" />
                <AdvancedSearch :filters="filters" :clear-filters="clearFilters" :seasons="seasons" :programs="programs"
                    :applied-filter-count="appliedFilterCount" />
            </div>
            <div class="h-full flex flex-column gap-2">
                <QuestionListHeader :results="filteredQuestions.length" />
                <QuestionList :questions="filteredQuestions" />
            </div>
        </div>
    </Root>
</template>

<style></style>
