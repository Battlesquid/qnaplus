<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import Button from 'primevue/button';
import { ref } from 'vue';
const header = ref<HTMLDivElement | null>(null);
const filler = ref<HTMLDivElement | null>(null);
const update = () => {
    if (window.scrollY !== 0) {
        header.value?.classList.add("header-sticky", "border-b", "border-blue-800");
        header.value?.classList.remove("border-surface")
        filler.value?.classList.remove("hidden")
    } else {
        header.value?.classList.remove("header-sticky", "border-b", "border-blue-800");
        header.value?.classList.add("border-surface")
        filler.value?.classList.add("hidden")
    }
}
update();
useEventListener(document, "scroll", () => update());
const appname = import.meta.env.VITE_APP_NAME;

</script>

<template>
    <div ref="filler" class="filler p-4 border-b hidden">
        <div class="p-4"></div>
    </div>
    <div ref="header"
        class="flex w-full bg-surface-0 dark:bg-surface-900 z-50 items-center justify-between gap-2 p-2 duration-1000 transition-colors">
        <h3 class="ml-1">{{ appname }}</h3>
        <div class="flex gap-2">
            <a href="https://github.com/Battlesquid/qnaplus" target="_blank">
                <Button class="w-8 h-8" icon="pi pi-github" aria-label="Github" outlined />
            </a>
            <Button class="w-8 h-8" icon="pi pi-cog" aria-label="Settings" outlined />
            <Button class="w-8 h-8" icon="pi pi-info-circle" aria-label="About" outlined />
        </div>
    </div>
</template>

<style scoped>
.header-sticky {
    position: fixed;
    top: 0;
}
</style>
