<script setup lang="ts">
import { ref } from "vue";
import QuestionList from "../components/QuestionList.vue";
import SearchFilters from "../components/SearchFilters.vue";
import SearchInput from "../components/SearchInput.vue";
import { useSearch } from "../composable/useSearch";
import Root from "./Root.vue";

const query = ref("");
const { questions } = useSearch(query);

</script>

<template>
    <Root>
        <div class="h-full flex flex-column gap-2 p-2">
            <div class="flex flex-column gap-2">
                <SearchInput v-model="query" />
                <SearchFilters />
            </div>
            <div class="h-full flex flex-column gap-2">
                <QuestionList :questions="questions" />
            </div>
        </div>
    </Root>
</template>

<style></style>
