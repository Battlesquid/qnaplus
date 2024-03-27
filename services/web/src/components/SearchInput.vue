<script setup lang="ts">

import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";

const query = defineModel<string>();

</script>

<template>
    <IconField iconPosition="left">
        <i class="pi pi-search"> </i>
        <InputText class="w-full" v-model:model-value="query" placeholder="Search" aria-label="Search Query" />
    </IconField>

</template>

<style scoped></style>
