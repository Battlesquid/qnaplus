<script setup lang="ts">
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import TabPanel from "primevue/tabpanel";
import { SearchSortOptions, basicSortOptions } from '../composable/useSort';

defineProps<{
    sortOptions: SearchSortOptions;
}>();

// const advanced = ref<boolean>(false);
</script>

<template>
    <TabPanel header="Sort">
        <div class="flex flex-column gap-2">
            <div class="flex justify-content-end">
                <div class="field m-0">
                    <label for="advanced_toggle">Advanced Sorting</label>
                    <InputSwitch v-model="sortOptions.advancedEnabled" input-id="advanced_toggle" />
                </div>
            </div>
            <div v-if="!sortOptions.advancedEnabled">
                <div class="field m-0">
                    <label for="basic_sort">Sort By:</label>
                    <Dropdown class="w-full" input-id="basic_sort" v-model="sortOptions.basic.sort" :options="basicSortOptions" option-label="name"
                        option-value="value" />
                </div>
            </div>
            <div v-else>

            </div>
        </div>
    </TabPanel>
</template>

<style scoped></style>