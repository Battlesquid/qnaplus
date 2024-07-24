<script setup lang="ts">
import { Node } from "domhandler";
import * as htmlparser2 from "htmlparser2";
import Button from "primevue/button";
import Divider from "primevue/divider";
import Tag from "primevue/tag";
import sanitize from "sanitize-html";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { resolveQuestionComponent, resolveQuestionComponentProps } from "../composable/componentMap";
import { getQuestion } from "../database";
import { isEmpty } from "../util/strings";
import Root from "./Root.vue";

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
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
    <div class="p-4">
      <Button label="Back" icon="pi pi-arrow-left" severity="secondary" @click="router.back()" outlined/>
      <div class="flex flex-column align-items-center" v-if="question === undefined">
        <h2>Uhhhhhhhhhh...</h2>
        <h4>Couldn't find a question here.</h4>
      </div>
      <div v-else>
        <a :href="question.url" target="_blank">
          <h2>{{ question.title }}</h2>
        </a>
        <div class="flex justify-content-between">
          <span class="text-gray-400">Asked by <b>{{ question.author }}</b> on <b>{{ question.askedTimestamp
              }}</b></span>
          <span v-if="question.answered" class="flex gap-2 text-green-500">
            <i class="pi pi-check " />
            <span v-if="!isEmpty(question.answeredTimestamp)">Answered on <b>{{ question.answeredTimestamp }}</b></span>
            <span v-else>Answered</span>
          </span>
          <span v-else class="text-gray-400">Unanswered</span>
        </div>
        <Divider />
        <div>
          <h3>Question</h3>
          <div class="text-gray-300">
            <component :is="resolveQuestionComponent(child)" v-bind="resolveQuestionComponentProps(child)"
              v-for="child in questionChildren" />
          </div>
        </div>
        <div>
          <div v-if="question.answered" class="text-gray-300">
            <h3>Answer</h3>
            <div>
              <component :is="resolveQuestionComponent(child)" v-bind="resolveQuestionComponentProps(child)"
                v-for="child in answerChildren" />
            </div>
          </div>
        </div>
        <Divider />
        <div class="flex gap-2 py-2">
          <Tag v-for="tag in question.tags">{{ tag }}</Tag>
        </div>
      </div>
    </div>
  </Root>
</template>

<style></style>