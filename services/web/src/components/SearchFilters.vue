<script setup lang="ts">
import Button from 'primevue/button';
import Calendar from "primevue/calendar";
import Chips from "primevue/chips";
import Divider from 'primevue/divider';
import IconField from "primevue/iconfield";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from "primevue/inputtext";
import MultiSelect from 'primevue/multiselect';
import Panel from "primevue/panel";
import SelectButton from 'primevue/selectbutton';
import { SearchFilterComposable, questionStates as options } from "../composable/useSearchFilter";

defineProps<Omit<SearchFilterComposable, "filteredQuestions">>();

</script>

<template>
    <Panel header="Filters" toggleable collapsed>
        <div class="flex flex-column gap-3">
            <div class="flex flex-wrap gap-2">
                <div class="flex flex-column gap-1">
                    <label for="season">Season</label>
                    <MultiSelect id="season" v-model="filters.season" placeholder="Season" />
                </div>
                <div class="flex flex-column gap-1">
                    <label for="program">Program</label>
                    <MultiSelect id="program" v-model="filters.program" placeholder="Program" />
                </div>
                <div class="flex flex-1 flex-column gap-1">
                    <label for="author">Author</label>
                    <IconField class="flex-1" icon-position="left">
                        <i class="pi pi-user"></i>
                        <InputText id="author" class="w-full" v-model="filters.author" placeholder="Author" />
                    </IconField>
                </div>
                <div class="flex flex-column gap-1">
                    <label for="Question State">Question State</label>
                    <SelectButton :allow-empty="false" v-model="filters.state" :options="options" option-label="name"
                        aria-labelledby="multiple" />
                </div>
            </div>
            <div class="flex">
                <div class="flex flex-1 flex-1 gap-2">
                    <div class="flex flex-column flex-1 gap-1">
                        <label for="askedBefore">Asked Before</label>
                        <Calendar id="askedBefore" v-model="filters.askedBefore" placeholder="Asked Before" show-icon
                            show-button-bar icon-display="input" />
                    </div>
                    <div class="flex flex-column flex-1 gap-1">
                        <label for="askedAfter">Asked After</label>
                        <Calendar id="askedAfter" v-model="filters.askedAfter" placeholder="Asked After" show-icon
                            show-button-bar icon-display="input" />
                    </div>
                </div>
                <Divider layout="vertical" />
                <div class="flex flex-1 gap-2">
                    <div class="flex flex-column flex-1 gap-1">
                        <label for="answeredBefore" aria-label="Answered Before">Answered Before</label>
                        <Calendar id="answeredBefore" v-model="filters.answeredBefore" placeholder="Answered Before"
                            show-icon show-button-bar icon-display="input" />
                    </div>
                    <div class="flex flex-column flex-1 gap-1">
                        <label for="answeredAfter" aria-label="Answered After">Answered After</label>
                        <Calendar id="answeredAfter" v-model="filters.answeredAfter" placeholder="Answered After"
                            show-icon show-button-bar icon-display="input" />
                    </div>
                </div>
            </div>
            <div class="flex flex-column flex-1 gap-2">
                <label for="tags">Tags</label>
                <InputGroup id="tags">
                    <InputGroupAddon>
                        <i class="pi pi-tags" aria-label="Search" />
                    </InputGroupAddon>
                    <Chips v-model="filters.tags" class="flex-1" aria-label="Tags" placeholder="Tags" />
                </InputGroup>
            </div>
            <div>
                <Button @click="clearFilters()">Clear Filters</Button>
            </div>
        </div>
    </Panel>
</template>

<style scoped></style>
