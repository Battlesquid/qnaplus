<script setup lang="ts">
import { Node as ParserNode } from 'domhandler';
import { resolveQuestionComponent, resolveQuestionComponentProps } from '../../composable/componentMap';

defineProps<{
    children: ParserNode[];
}>();
</script>

<template>
    <div class="surface-card p-3 border-left-3 border-blue-500 text-gray-300">
        <component :is="resolveQuestionComponent(child)" v-bind="resolveQuestionComponentProps(child)"
            v-for="child in children" />
    </div>
</template>

<style scoped>
</style>