<script setup lang="ts">
import { Node } from 'domhandler';
import { resolveQuestionComponent, resolveQuestionComponentProps } from '../../composable/componentMap';

defineProps<{
    children: Node[];
}>();
</script>

<template>
    <div class="p-3 border-left-3 border-blue-500 text-gray-300">
        <component :is="resolveQuestionComponent(child)" v-bind="resolveQuestionComponentProps(child)"
            v-for="child in children" />
    </div>
</template>

<style scoped>
</style>