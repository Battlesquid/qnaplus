<script setup lang="ts">
import Button from 'primevue/button';
</script>

<template>
    <div class="sticky flex align-items-center justify-content-between gap-2 border-bottom-1 border-indigo-800 p-2">
        <div class="p-3 ">qnaplus</div>
        <div class="flex gap-2">
            <a href="https://github.com/Battlesquid/qnaplus">
                <Button class="w-2rem h-2rem" icon="pi pi-github" aria-label="Github" outlined/>
            </a>
            <Button class="w-2rem h-2rem" icon="pi pi-cog" aria-label="Settings" outlined/>
            <Button class="w-2rem h-2rem" icon="pi pi-info-circle" aria-label="About" outlined/>
        </div>
    </div>
</template>

<style scoped>

</style>
