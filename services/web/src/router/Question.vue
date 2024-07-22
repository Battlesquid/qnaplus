<script setup lang="ts">
import * as htmlparser2 from "htmlparser2";
import { ref } from "vue";
import Root from "./Root.vue";
import { getQuestion } from "../database";
import { resolveProps, ComponentMap } from "../composable/componentMap";
const props = defineProps<{
  id: string;
}>();

const loading = ref<boolean>(true);
const question = await getQuestion(props.id);
loading.value = false;

const dom = htmlparser2.parseDocument(question?.questionRaw ?? "");
console.log(dom);

</script>

<template>
  <Root>
    <div v-if="question === undefined">
      whar
    </div>
    <div v-else>
      <div>
        <component :is="ComponentMap[child.name]" v-bind="resolveProps(child.name, child)"
          v-for="child in dom.children" />
      </div>
      <!-- <div v-html="question.questionRaw" />
      ============
      <div v-html="question.answerRaw" /> -->
    </div>
  </Root>
</template>

<style></style>