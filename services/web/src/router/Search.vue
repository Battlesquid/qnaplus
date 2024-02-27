<script setup lang="ts">
import SearchFilters from "../components/SearchFilters.vue";
import SearchInput from "../components/SearchInput.vue";
import Root from "./Root.vue";
import QuestionCard from "../components/QuestionCard.vue";
import questions from "../data.json";
</script>

<template>
    <Root>
        <div class="h-full flex flex-column gap-2 p-2">
            <div class="flex flex-column gap-2">
                <SearchInput/>
                <SearchFilters/>
            </div>
            <div class="h-full flex flex-column gap-2">
                <div v-for="question in questions">
                    <QuestionCard :id="question.id" :title="question.title" :question="question.question"
                                  :answered="question.answered" :author="question.author"
                                  :asked-timestamp-ms="question.askedTimestampMs" :program="question.program"
                                  :answered-timestamp-ms="question.answeredTimestampMs" :url="question.url"
                                  :tags="question.tags" :answer="question.answer"
                                  :asked-timestamp="question.askedTimestamp" :season="question.season"
                                  :answer-raw="question.answerRaw" :question-raw="question.questionRaw"
                                  :answered-timestamp="question.answeredTimestamp"/>
                </div>
            </div>
        </div>
    </Root>
</template>

<style>
</style>
