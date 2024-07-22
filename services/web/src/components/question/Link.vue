<script setup lang="ts">
import { Node } from 'domhandler';
import { resolveQuestionComponent, resolveQuestionComponentProps } from '../../composable/componentMap';

defineProps<{
    href: string;
    children: Node[];
}>();
</script>

<template>
    <a :href="href">
        <component :is="resolveQuestionComponent(child)" v-bind="resolveQuestionComponentProps(child)"
            v-for="child in children" />
    </a>
</template>

<style scoped></style>