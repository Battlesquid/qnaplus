<script setup lang="ts">
import { ComponentMap, resolveProps } from '../../composable/componentMap';
import Paragraph from "../components/question/Paragraph.vue"
import Image from "primevue/image"

defineProps<{
    children: ChildNode[];
}>();
</script>

<template>
    <p>
        <component :is="ComponentMap[child.name]" v-bind="resolveProps(child.name, child as Element)" v-for="child in children">
            <!-- <component :is="child.nodeType" :children="child.childNodes"></component> -->
        </component>
    </p>
</template>

<style scoped></style>