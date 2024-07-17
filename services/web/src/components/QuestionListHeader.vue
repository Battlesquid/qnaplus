<script setup lang="ts">

defineProps<{
    results: number;
}>();

</script>

<template>
    <div class="flex justify-between p-4">
        <div></div>
        <div class="text-sm">{{ results }} results</div>
    </div>
</template>

<style scoped></style>
