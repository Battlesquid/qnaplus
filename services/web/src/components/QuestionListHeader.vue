<script setup lang="ts">

defineProps<{
    results: number;
}>();

</script>

<template>
    <div class="flex justify-content-between p-3">
        <div></div>
        <div class="text-sm">{{ results }} results</div>
    </div>
</template>

<style scoped></style>
