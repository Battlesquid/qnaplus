<script setup lang="ts">
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import { Question } from "vex-qna-archiver";
import { applyWordLimit, isEmpty } from "../util/strings";
defineProps<Question>();

</script>

<template>
    <Card :class="{ 'border-primary': answered, 'border-300': !answered }">
        <template #title>
            <a :href="url">{{ title }}</a>
        </template>
        <template #subtitle>
            <div class="flex justify-content-between">
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
            <div class="flex flex-column gap-2">
                <!-- <div class="flex flex-column gap-1">
                    <span class="font-bold">Question</span>
                    <span>{{ applyWordLimit(question, 100) }}</span>
                </div> -->
                <div v-if="answered" class="flex flex-column gap-1">
                    <span class="font-bold">Answer</span>
                    <span>{{ applyWordLimit(answer, 100) }}</span>
                </div>
            </div>
        </template>
        <template #footer v-if="tags.length > 0">
            <div class="flex gap-2">
                <Tag v-for="tag in tags">{{ tag }}</Tag>
            </div>
        </template>
    </Card>
</template>

<style scoped></style>
