<script setup lang="ts">
import SearchFilters from "../components/SearchFilters.vue";
import SearchInput from "../components/SearchInput.vue";
import Root from "./Root.vue";
</script>

<template>
    <Root>
        <div class="h-full flex flex-column gap-2 p-2">
            <div class="flex flex-column gap-2">
                <SearchInput/>
                <SearchFilters/>
            </div>
            <div class="h-full flex flex-column gap-2">
                <QuestionList />
            </div>
        </div>
    </Root>
</template>

<style>
</style>
