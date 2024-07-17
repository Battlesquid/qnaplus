<script setup lang="ts">
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';
import { Question } from "vex-qna-archiver";
import { applyWordLimit, isEmpty } from "../util/strings";

const props = defineProps<Question>();

const limitedQuestion = applyWordLimit(props.question, 100);
const limitedAnswer = applyWordLimit(props.answer, 100);

</script>

<template>
    <Card :class="{ 'border-primary': answered, 'border-300': !answered }">
        <template #title>
            <a :href="url" target="_blank">{{ title }}</a>
        </template>
        <template #subtitle>
            <div class="flex justify-between">
                <span>Asked by <b>{{ author }}</b> on <b>{{ askedTimestamp }}</b></span>
                <span v-if="answered" class="flex gap-2 text-green-500">
                    <i class="pi pi-check " />
                    <span v-if="!isEmpty(answeredTimestamp)">Answered on {{ answeredTimestamp }}</span>
                    <span v-else>Answered</span>
                </span>
                <span v-else class="text-gray-400">Unanswered</span>
            </div>
        </template>
        <template #content>
            <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-1">
                    <span class="font-bold">Question</span>
                    <span>{{ limitedQuestion.content }}</span>
                </div>
                <div v-if="answered" class="flex flex-col gap-1">
                    <span class="font-bold">Answer</span>
                    <span>{{ limitedAnswer.content }}</span>
                </div>
                <a v-if="limitedAnswer.applied || limitedQuestion.applied" :href="url">Read More</a>
            </div>
        </template>
        <template #footer v-if="tags.length > 0">
            <div class="flex gap-2">
                <Tag v-for="tag in tags">{{ tag }}</Tag>
            </div>
        </template>
    </Card>
    <Divider />
</template>

<style scoped></style>
