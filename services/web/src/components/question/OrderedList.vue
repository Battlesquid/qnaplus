<script setup lang="ts">
import { Node } from 'domhandler';
import { resolveQuestionComponent, resolveQuestionComponentProps } from '../../composable/componentMap';

defineProps<{
    children: Node[];
}>();
</script>

<template>
    <ol>
        <component :is="resolveQuestionComponent(child)" v-bind="resolveQuestionComponentProps(child)"
            v-for="child in children" />
    </ol>
</template>
