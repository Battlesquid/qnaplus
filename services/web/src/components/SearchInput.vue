<script setup lang="ts">

import InputText from "primevue/inputtext";
import Button from "primevue/button";
import InputGroup from "primevue/inputgroup";

const query = defineModel<string>();

</script>

<template>
    <InputGroup icon-position="left">
        <InputText class="w-full" v-model:model-value="query" placeholder="Search" aria-label="Search Query" />
        <Button icon="pi pi-search" aria-label="Search" />
    </InputGroup>
</template>

<style scoped></style>
