<script setup lang="ts">
import InputText from "primevue/inputtext"
import FloatLabel from "primevue/floatlabel"
import IconField from "primevue/iconfield"
import InputIcon from "primevue/inputicon"
</script>

<template>
    <div class="flex">
        <FloatLabel>
            <IconField iconPosition="left">
                <InputIcon class="pi pi-search" />
                <InputText placeholder="Search" />
            </IconField>
        </FloatLabel>
    </div>
</template>

<style scoped></style>