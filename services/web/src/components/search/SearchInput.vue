<script setup lang="ts">

import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon"

const query = defineModel<string>();

</script>

<template>
    <IconField iconPosition="left">
        <InputIcon class="pi pi-search" />
        <InputText class="w-full" v-model:model-value="query" placeholder="Search" aria-label="Search Query" />
    </IconField>

</template>

<style scoped></style>
