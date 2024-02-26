<script setup lang="ts">
import InputText from "primevue/inputtext"
import Divider from 'primevue/divider';
import Chips from "primevue/chips"
import Calendar from "primevue/calendar"
import SelectButton from 'primevue/selectbutton';
import MultiSelect from 'primevue/multiselect';
import Panel from "primevue/panel";
import InputGroup from "primevue/inputgroup";
import IconField from "primevue/iconfield";
import InputGroupAddon from 'primevue/inputgroupaddon';
import { ref } from "vue";

const beforeAnswerDate = ref<Date | null>(null);
const afterAnswerDate = ref<Date | null>(null);
const beforeAskedDate = ref<Date | null>(null);
const afterAskedDate = ref<Date | null>(null);

const value = ref(null);
const tags = ref<string[]>([]);
const options = ref([
    { name: "All", value: "All" },
    { name: 'Answered', value: 1 },
    { name: 'Unanswered', value: 2 }
]);
</script>

<template>
    <Panel header="Filters" toggleable collapsed>
        <div class="flex flex-column gap-2">
            <div class="flex flex-wrap gap-2">
                <MultiSelect placeholder="Season" />
                <MultiSelect placeholder="Program" />
                <IconField class="flex-1" icon-position="left">
                    <i class="pi pi-user"></i>
                    <InputText class="w-full" placeholder="Author" />
                </IconField>
                <SelectButton v-model="value" :options="options" optionLabel="name" aria-labelledby="multiple" />
            </div>
            <div class="flex">
                <div class="flex flex-1 gap-2">
                    <Calendar class="flex-1" v-model="beforeAskedDate" placeholder="Asked Before" show-icon
                        icon-display="input" />
                    <Calendar class="flex-1" v-model="afterAskedDate" placeholder="Asked After" show-icon
                        icon-display="input" />
                </div>
                <Divider layout="vertical" />
                <div class="flex flex-1 gap-2">
                    <Calendar class="flex-1" v-model="beforeAnswerDate" placeholder="Answered Before" show-icon
                        icon-display="input" />
                    <Calendar class="flex-1" v-model="afterAnswerDate" placeholder="Answered After" show-icon
                        icon-display="input" />
                </div>
            </div>
            <div class="flex gap-2">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-tags" aria-label="Search" />
                    </InputGroupAddon>
                    <Chips v-model="tags" class="flex-1" aria-label="Tags" placeholder="Tags" />
                </InputGroup>
            </div>
        </div>
    </Panel>
</template>

<style scoped></style>
