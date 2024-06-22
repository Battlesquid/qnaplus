<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import TabView from "primevue/tabview";
import { SearchFilters } from "../composable/useSearchFilter";
import SearchFilter from "../components/SearchFilter.vue";
import { Option } from "../composable/";

defineProps<{
    filters: SearchFilters;
    appliedFilterCount: number;
    clearFilters(): void;
    seasons: Option<string>[];
    programs: Option<string>[];
}>();
</script>

<template>

    <Accordion>
        <AccordionTab>
            <template #header>
                Search Options
            </template>
            <TabView>
                <SearchFilter :filters="filters" :clear-filters="clearFilters" :seasons="seasons" :programs="programs"
                    :applied-filter-count="appliedFilterCount" />
                <slot name="sorting"></slot>
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
