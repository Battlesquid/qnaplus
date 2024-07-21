<script setup lang="ts">
import Root from "./Root.vue"
import Paragraph from "../components/question/Paragraph.vue"
import * as htmlparser2 from "htmlparser2";

defineProps({
  id: String
});

const ComponentMap = {
    p: Paragraph
}

const parser = new htmlparser2.Parser();
const tree = parser.write();

</script>

<template>
    <Root>
        
    </Root>
</template>

<style>

</style>