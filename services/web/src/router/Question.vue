<script setup lang="ts">
import { Node as ParserNode } from "domhandler";
import * as htmlparser2 from "htmlparser2";
import Divider from "primevue/divider";
import Tag from "primevue/tag";
import sanitize from "sanitize-html";
import { resolveQuestionComponent, resolveQuestionComponentProps } from "../composable/componentMap";
import { getQuestion } from "../database";
import { isEmpty } from "../util/strings";
import Root from "./Root.vue";
import Message from "primevue/message";
import { ref } from "vue";

const props = defineProps<{
  id: string;
}>();

const archived = ref<boolean | null | undefined>(undefined);
const question = await getQuestion(props.id);

const getStatus = async () => {
  if (question !== undefined) {
    const url = `${import.meta.env.PRECHECK_WORKER}?program=${question.program}&season=${question.season}&id=${question.id}`
    try {
      const fetchedQuestion = await fetch(url);
      archived.value = fetchedQuestion.status === 404;
    } catch (error) {
      archived.value = null
    }
  }
}

getStatus();

const sanitizeOptions: sanitize.IOptions = {
  allowedTags: sanitize.defaults.allowedTags.concat("img")
}

const sanitizedQuestionHTML = sanitize(question?.questionRaw ?? "", sanitizeOptions);
const questionDom = htmlparser2.parseDocument(sanitizedQuestionHTML);
const questionChildren = questionDom.children as ParserNode[];

const sanitizedAnswerHTML = sanitize(question?.answerRaw ?? "", sanitizeOptions);
const answerDom = htmlparser2.parseDocument(sanitizedAnswerHTML);
const answerChildren = answerDom.children as ParserNode[];
</script>

<template>
  <Root>
    <div class="p-4">
      <div class="flex flex-column align-items-center" v-if="question === undefined">
        <h2>Uhhhhhhhhhh...</h2>
        <h4>Couldn't find a question here.</h4>
      </div>
      <div v-else>
        <Message v-if="archived" severity="warn" :closable="false">Archived: Question is no longer available on the Q&A.
        </Message>
        <Message v-if="archived === null" severity="warn" :closable="false">Warning: Unable to check if Q&A exists.
        </Message>
        <a :href="question.url" target="_blank">
          <h2>{{ question.title }}</h2>
        </a>
        <div class="flex flex-column gap-1">
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
            <div class="question-divider border-gray-400" />
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

<style scoped>
.question-divider {
  border-width: 1px;
  border-style: dashed;
}
</style>