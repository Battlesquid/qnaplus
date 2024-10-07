<script setup lang="ts">
import { Node as ParserNode } from 'domhandler';
import { resolveQuestionComponent, resolveQuestionComponentProps } from '../../composable/componentMap';

defineProps<{
    children: ParserNode[];
}>();
</script>

<template>
    <blockquote class="prose-blockquote">
        <component :is="resolveQuestionComponent(child)" v-bind="resolveQuestionComponentProps(child)"
            v-for="child in children" />
    </blockquote>
</template>

<style scoped>
</style>