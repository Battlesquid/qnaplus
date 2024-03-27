<script setup lang="ts">
import { ref } from "vue";
import QuestionList from "../components/QuestionList.vue";
import SearchFilters from "../components/SearchFilters.vue";
import SearchInput from "../components/SearchInput.vue";
import { useLoadResources, useSearch } from "../composable/useSearch";
import Root from "./Root.vue";
import { useSearchFilter } from "../composable/useSearchFilter";

useLoadResources();
const query = ref("");
const { questions } = useSearch(query);
const { filteredQuestions, filters, clearFilters } = useSearchFilter(questions);

</script>

<template>
    <Root>
        <div class="h-full flex flex-column gap-2 p-2">
            <div class="flex flex-column gap-2">
                <SearchInput v-model="query" />
                <SearchFilters :filters="filters" :clear-filters="clearFilters" />
            </div>
            <div class="h-full flex flex-column gap-2">
                <QuestionList :questions="filteredQuestions" />
            </div>
        </div>
    </Root>
</template>

<style></style>
