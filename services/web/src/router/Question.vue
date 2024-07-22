<script setup lang="ts">
import { Node } from "domhandler";
import * as htmlparser2 from "htmlparser2";
import { ref } from "vue";
import { resolveQuestionComponent, resolveQuestionComponentProps } from "../composable/componentMap";
import { getQuestion } from "../database";
import Root from "./Root.vue";
import sanitize from "sanitize-html";

const props = defineProps<{
  id: string;
}>();

const loading = ref<boolean>(true);
const question = await getQuestion(props.id);
loading.value = false;

const sanitizeOptions: sanitize.IOptions = {
  allowedTags: sanitize.defaults.allowedTags.concat("img")
}

const sanitizedQuestionHTML = sanitize(question?.questionRaw ?? "", sanitizeOptions);
const questionDom = htmlparser2.parseDocument(sanitizedQuestionHTML);
const questionChildren = questionDom.children as Node[];

const sanitizedAnswerHTML = sanitize(question?.answerRaw ?? "", sanitizeOptions);
const answerDom = htmlparser2.parseDocument(sanitizedAnswerHTML);
const answerChildren = answerDom.children as Node[];

</script>

<template>
  <Root>
    <div v-if="question === undefined">
      whar
    </div>
    <div v-else>
      <h2>{{ question.title }}</h2>
      <h3>Question</h3>
      <div>
        <component :is="resolveQuestionComponent(child)" v-bind="resolveQuestionComponentProps(child)"
          v-for="child in questionChildren" />
      </div>

      <div v-if="question.answered">
        <h3>Answer</h3>
        <div>
          <component :is="resolveQuestionComponent(child)" v-bind="resolveQuestionComponentProps(child)"
            v-for="child in answerChildren" />
        </div>
      </div>
    </div>
  </Root>
</template>

<style></style>