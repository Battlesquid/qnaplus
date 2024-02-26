<script setup lang="ts">
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import { Question } from "vex-qna-archiver";

defineProps<Question>();

</script>

<template>
    <Card class="border-left-1" :class="{ 'border-primary': answered, 'border-300': !answered }">
        <template #title>{{ title }}</template>
        <template #subtitle>Asked by {{ author }}</template>
        <template #content>
            <div class="flex flex-column gap-2">
                <div class="flex gap-1">
                    <i class="pi pi-calendar" />
                    <span>Asked on {{ askedTimestamp }}</span>
                </div>
                <div v-if="answeredTimestamp" class="flex gap-1">
                    <i class="pi pi-calendar"/>
                    <span>Answered on {{ answeredTimestamp }}</span>
                </div>
            </div>
        </template>
        <template v-if="tags.length > 0" #footer>
            <div class="flex gap-2">
                <Tag v-for="tag in tags">
                    {{ tag }}
                </Tag>
            </div>
        </template>
    </Card>
</template>

<style scoped></style>
