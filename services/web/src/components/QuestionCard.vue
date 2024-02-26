<script setup lang="ts">
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import {Question} from "vex-qna-archiver";

defineProps<Question>();

</script>

<template>
    <Card>
        <template #title>{{ title }}</template>
        <template #subtitle>Asked by {{ author }}</template>
        <template #content>
            <div class="flex flex-column">
                <div class="flex gap-1">
                    <i class="pi pi-calendar"></i>
                    <span>Asked on {{ askedTimestamp }}</span>
                </div>
            </div>
            <div v-if="answeredTimestamp" class="flex flex-column">
                <div class="flex flex-column gap-1">
                    <i class="pi pi-calendar"></i>
                    <span>Answered on {{ answeredTimestamp }}</span>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex gap-2">
                <Tag v-for="tag in tags">
                    {{ tag }}
                </Tag>
            </div>
        </template>
    </Card>
</template>

<style scoped>

</style>
