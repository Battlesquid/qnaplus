<script setup lang="ts">
import QuestionCard from "../components/QuestionCard.vue";
import { Question } from "vex-qna-archiver";

defineProps<{
    questions: Question[]
}>()
</script>

<template>
    <div v-for="question in questions">
        <QuestionCard :id="question.id" :title="question.title" :question="question.question"
            :answered="question.answered" :author="question.author" :asked-timestamp-ms="question.askedTimestampMs"
            :program="question.program" :answered-timestamp-ms="question.answeredTimestampMs" :url="question.url"
            :tags="question.tags" :answer="question.answer" :asked-timestamp="question.askedTimestamp"
            :season="question.season" :answer-raw="question.answerRaw" :question-raw="question.questionRaw"
            :answered-timestamp="question.answeredTimestamp" />
    </div>
</template>

<style scoped></style>