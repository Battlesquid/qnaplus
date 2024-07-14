<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Calendar from "primevue/calendar";
import Chips from "primevue/chips";
import Dropdown from 'primevue/dropdown';
import IconField from "primevue/iconfield";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputSwitch from 'primevue/inputswitch';
import InputText from "primevue/inputtext";
import MultiSelect from 'primevue/multiselect';
import SelectButton from 'primevue/selectbutton';
import { VueDraggable } from "vue-draggable-plus";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import Divider from 'primevue/divider';
import { computed } from "vue";
import { SearchFilterOptions, questionStateOptions } from "../composable/useSearchFilter";
import { SearchSortOptions, SortOptions, sortOptionsList, sortOrderList } from "../composable/useSort";
import { Option } from "../composable";

const props = defineProps<{
    filterOptions: SearchFilterOptions;
    sortOptions: SearchSortOptions;
}>();

const remainingAdvancedOptions = computed(() => {
    return sortOptionsList.filter(sortOption => !props.sortOptions.advanced.find(selectedSortOption => sortOption.value === selectedSortOption.value))
});


const updateSelectedAdvancedOption = (value: Option<SortOptions>) => {
    props.sortOptions.advanced.push({ ...value, asc: sortOrderList[0] });
}

const removeSelectedAdvancedOption = (index: number) => {
    props.sortOptions.advanced.splice(index, 1);
}

</script>

<template>

    <Accordion>
        <AccordionTab>
            <template #header>
                Search Options
            </template>
            <TabView>
                <TabPanel header="Filter">
                    <template #header>
                        <Badge class="ml-2" :value="filterOptions.appliedFilterCount.value" />
                    </template>
                    <div class="flex flex-column gap-2">
                        <div class="flex flex-wrap gap-2">

                            <div class="flex flex-wrap gap-2 flex-1">
                                <div class="field m-0 dropdown-flex">
                                    <label for="season">Season</label>
                                    <MultiSelect class="w-full" input-id="season" v-model="filterOptions.filters.season"
                                        placeholder="Season" :options="filterOptions.seasons" option-label="name" />
                                </div>
                                <div class="field m-0 dropdown-flex">
                                    <label for="program">Program</label>
                                    <MultiSelect class="w-full" input-id="program"
                                        v-model="filterOptions.filters.program" placeholder="Program"
                                        :options="filterOptions.programs" option-label="name" />
                                </div>
                            </div>

                            <div class="flex flex-1 flex-wrap gap-2">
                                <div class="field m-0 input-flex">
                                    <label for="author">Author</label>
                                    <IconField icon-position="left">
                                        <i class="pi pi-user"></i>
                                        <InputText id="author" class="w-full" v-model="filterOptions.filters.author"
                                            placeholder="Author" />
                                    </IconField>
                                </div>

                                <div class="field m-0 input-flex">
                                    <label for="Question State">Question State</label>
                                    <SelectButton class="select-button-flex" :allow-empty="false"
                                        v-model="filterOptions.filters.state" :options="questionStateOptions"
                                        option-label="name" aria-labelledby="multiple" />
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 ">
                            <div class="flex flex-1 min-w-fit gap-2">
                                <div class="field m-0 flex-1">
                                    <label for="askedBefore">Asked Before</label>
                                    <Calendar class="w-full" input-id="askedBefore"
                                        v-model="filterOptions.filters.askedBefore" placeholder="Asked Before" show-icon
                                        show-button-bar icon-display="input" />
                                </div>
                                <div class="field m-0 flex-1">
                                    <label for="askedAfter">Asked After</label>
                                    <Calendar class="w-full" input-id="askedAfter"
                                        v-model="filterOptions.filters.askedAfter" placeholder="Asked After" show-icon
                                        show-button-bar icon-display="input" />
                                </div>
                            </div>
                            <div class="flex flex-1 min-w-fit gap-2">
                                <div class="field m-0 flex-1">
                                    <label for="answeredBefore" aria-label="Answered Before">Answered Before</label>
                                    <Calendar class="w-full" input-id="answeredBefore"
                                        v-model="filterOptions.filters.answeredBefore" placeholder="Answered Before"
                                        show-icon show-button-bar icon-display="input" />
                                </div>
                                <div class="field m-0 flex-1">
                                    <label for="answeredAfter" aria-label="Answered After">Answered After</label>
                                    <Calendar class="w-full" input-id="answeredAfter"
                                        v-model="filterOptions.filters.answeredAfter" placeholder="Answered After"
                                        show-icon show-button-bar icon-display="input" />
                                </div>
                            </div>
                        </div>
                        <div class="field m-0">
                            <label for="tags">Tags</label>
                            <InputGroup>
                                <InputGroupAddon>
                                    <i class="pi pi-tags" aria-label="Search" />
                                </InputGroupAddon>
                                <Chips input-id="tags" v-model="filterOptions.filters.tags" class="flex-1"
                                    aria-label="Tags" placeholder="Tags" />
                            </InputGroup>
                        </div>
                        <div>
                            <Button @click="filterOptions.clearFilters()"><b>Clear Filters</b></Button>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <template #header>
                        <span style="height: 24px">Sort</span>
                    </template>
                    <div class="flex flex-column gap-2">
                        <div class="flex justify-content-end">
                            <div class="flex align-items-center gap-2">
                                <label for="advanced_toggle">Advanced Sorting</label>
                                <InputSwitch v-model="sortOptions.advancedEnabled" input-id="advanced_toggle" />
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2" v-if="!sortOptions.advancedEnabled">
                            <div class="field flex-1 m-0">
                                <label for="basic_sort_option">Sort By</label>
                                <Dropdown class="w-full" input-id="basic_sort_option" v-model="sortOptions.basic.sort"
                                    :options="sortOptionsList" option-label="name" />
                            </div>
                            <div class="field flex-1 m-0">
                                <label for="basic_sort_order">Order</label>
                                <Dropdown class="w-full" input-id="basic_sort_order" v-model="sortOptions.basic.asc"
                                    :options="sortOrderList" option-label="name" />
                            </div>
                        </div>
                        <div class="flex flex-column gap-2" v-else>
                            <div class="field flex-1">
                                <label for="sort_option">Sort Option</label>
                                <Dropdown class="w-full" input-id="sort_option" :options="remainingAdvancedOptions"
                                    option-label="name" @update:model-value="updateSelectedAdvancedOption" />
                            </div>
                            <VueDraggable ref="el" v-model="sortOptions.advanced" ghostClass="sort-ghost"
                                dragClass="sort-drag" :animation="150" handle=".handle">
                                <div v-for="(option, index) in sortOptions.advanced">
                                    <div class="flex gap-2 align-items-center">
                                        <div class="handle cursor-move pi pi-list ml-2"></div>
                                        <em class="flex-1">{{ option.name }}</em>
                                        <div class="flex flex-1 align-items-center gap-2 m-0">
                                            <label :for="'advanced_sort_order_' + option.name">Order:</label>
                                            <Dropdown class="flex-1" :input-id="'advanced_sort_order_' + option.name"
                                                v-model="sortOptions.advanced[index].asc" :options="sortOrderList"
                                                option-label="name" />
                                        </div>
                                        <Button type="button" severity="secondary" rounded outlined
                                            aria-label="Remove Sort" icon="pi pi-times"
                                            @click="removeSelectedAdvancedOption(index)" />
                                    </div>
                                    <Divider />
                                </div>
                            </VueDraggable>
                        </div>
                    </div>
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

.sort-ghost {
    opacity: 0;
}

.sort-drag {
    /* all: unset; */
}
</style>
