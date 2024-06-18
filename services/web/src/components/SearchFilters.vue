<script setup lang="ts">
import Button from 'primevue/button';
import Calendar from "primevue/calendar";
import Chips from "primevue/chips";
import IconField from "primevue/iconfield";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from "primevue/inputtext";
import MultiSelect from 'primevue/multiselect';
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import SelectButton from 'primevue/selectbutton';
import { SearchFilters, questionStates as options, Option } from "../composable/useSearchFilter";

defineProps<{
    filters: SearchFilters;
    clearFilters(): void;
    seasons: Option<string>[];
    programs: Option<string>[];
}>();

</script>

<template>

    <Accordion :activeIndex="0">
        <AccordionTab header="Filters">
            <div class="flex flex-column gap-3">
                <div class="flex flex-wrap gap-2">

                    <div class="flex gap-2 w-full">
                        <div class="flex flex-column flex-grow-1 gap-1">
                            <label for="season">Season</label>
                            <MultiSelect id="season" v-model="filters.season" placeholder="Season" :options="seasons"
                                option-label="name" />
                        </div>
                        <div class="flex flex-column flex-grow-1 gap-1">
                            <label for="program">Program</label>
                            <MultiSelect id="program" v-model="filters.program" placeholder="Program"
                                :options="programs" option-label="name" />
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 w-full">
                        <div class="flex flex-grow-1 flex-column gap-1">
                            <label for="author">Author</label>
                            <IconField class="flex-1" icon-position="left">
                                <i class="pi pi-user"></i>
                                <InputText id="author" class="w-full" v-model="filters.author" placeholder="Author" />
                            </IconField>
                        </div>

                        <div class="flex flex-column flex-grow-1 gap-1">
                            <label for="Question State">Question State</label>
                            <SelectButton class="select-button-flex" :allow-empty="false" v-model="filters.state"
                                :options="options" option-label="name" aria-labelledby="multiple" />
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 ">
                    <div class="flex flex-1 flex-1 min-w-fit gap-2">
                        <div class="flex flex-column flex-1 gap-1">
                            <label for="askedBefore">Asked Before</label>
                            <Calendar id="askedBefore" v-model="filters.askedBefore" placeholder="Asked Before"
                                show-icon show-button-bar icon-display="input" />
                        </div>
                        <div class="flex flex-column flex-1 gap-1">
                            <label for="askedAfter">Asked After</label>
                            <Calendar id="askedAfter" v-model="filters.askedAfter" placeholder="Asked After" show-icon
                                show-button-bar icon-display="input" />
                        </div>
                    </div>
                    <div class="flex flex-1 min-w-fit gap-2">
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
        </AccordionTab>
    </Accordion>
</template>

<style scoped>
.min-w-fit {
    min-width: fit-content;
}

.select-button-flex {
    display: flex;
}
</style>
