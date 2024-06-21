<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Calendar from "primevue/calendar";
import Chips from "primevue/chips";
import IconField from "primevue/iconfield";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from "primevue/inputtext";
import MultiSelect from 'primevue/multiselect';
import SelectButton from 'primevue/selectbutton';
import { Option, SearchFilters, questionStates as options } from "../composable/useSearchFilter";
import { ref } from "vue";

defineProps<{
    filters: SearchFilters;
    appliedFilterCount: number;
    clearFilters(): void;
    seasons: Option<string>[];
    programs: Option<string>[];
}>();

const activeTab = ref<number>(0);

</script>

<template>

    <Accordion>
        <AccordionTab>
            <template #header>
                <div class="flex gap-2 align-items-center justify-content-between">
                    <span>Search Options</span>
                </div>
            </template>

            <TabView v-model:activeIndex="activeTab">
                <TabPanel header="Filters">
                    <template #header>
                        <Badge class="ml-2" :value="appliedFilterCount" />
                    </template>
                    <div class="flex flex-column gap-2">
                        <div class="flex flex-wrap gap-2">

                            <div class="flex flex-wrap gap-2 flex-1">
                                <div class="field m-0 dropdown-flex">
                                    <label for="season">Season</label>
                                    <MultiSelect class="w-full" input-id="season" v-model="filters.season"
                                        placeholder="Season" :options="seasons" option-label="name" />
                                </div>
                                <div class="field m-0 dropdown-flex">
                                    <label for="program">Program</label>
                                    <MultiSelect class="w-full" input-id="program" v-model="filters.program"
                                        placeholder="Program" :options="programs" option-label="name" />
                                </div>
                            </div>

                            <div class="flex flex-1 flex-wrap gap-2">
                                <div class="field m-0 input-flex">
                                    <label for="author">Author</label>
                                    <IconField icon-position="left">
                                        <i class="pi pi-user"></i>
                                        <InputText id="author" class="w-full" v-model="filters.author"
                                            placeholder="Author" />
                                    </IconField>
                                </div>

                                <div class="field m-0 input-flex">
                                    <label for="Question State">Question State</label>
                                    <SelectButton class="select-button-flex" :allow-empty="false"
                                        v-model="filters.state" :options="options" option-label="name"
                                        aria-labelledby="multiple" />
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 ">
                            <div class="flex flex-1 min-w-fit gap-2">
                                <div class="field m-0 flex-1">
                                    <label for="askedBefore">Asked Before</label>
                                    <Calendar class="w-full" input-id="askedBefore" v-model="filters.askedBefore"
                                        placeholder="Asked Before" show-icon show-button-bar icon-display="input" />
                                </div>
                                <div class="field m-0 flex-1">
                                    <label for="askedAfter">Asked After</label>
                                    <Calendar class="w-full" input-id="askedAfter" v-model="filters.askedAfter"
                                        placeholder="Asked After" show-icon show-button-bar icon-display="input" />
                                </div>
                            </div>
                            <div class="flex flex-1 min-w-fit gap-2">
                                <div class="field m-0 flex-1">
                                    <label for="answeredBefore" aria-label="Answered Before">Answered Before</label>
                                    <Calendar class="w-full" input-id="answeredBefore" v-model="filters.answeredBefore"
                                        placeholder="Answered Before" show-icon show-button-bar icon-display="input" />
                                </div>
                                <div class="field m-0 flex-1">
                                    <label for="answeredAfter" aria-label="Answered After">Answered After</label>
                                    <Calendar class="w-full" input-id="answeredAfter" v-model="filters.answeredAfter"
                                        placeholder="Answered After" show-icon show-button-bar icon-display="input" />
                                </div>
                            </div>
                        </div>
                        <div class="field m-0">
                            <label for="tags">Tags</label>
                            <InputGroup>
                                <InputGroupAddon>
                                    <i class="pi pi-tags" aria-label="Search" />
                                </InputGroupAddon>
                                <Chips input-id="tags" v-model="filters.tags" class="flex-1" aria-label="Tags"
                                    placeholder="Tags" />
                            </InputGroup>
                        </div>
                        <div>
                            <Button @click="clearFilters()"><b>Clear Filters</b></Button>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Sort">

                </TabPanel>
            </TabView>

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

.dropdown-flex {
    flex: 231.6px
}

.input-flex {
    flex: 170px;
}
</style>
