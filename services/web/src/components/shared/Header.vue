<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import Button from 'primevue/button';
import { ref } from 'vue';
const header = ref<HTMLDivElement | null>(null);
const filler = ref<HTMLDivElement | null>(null);
const update = () => {
    if (window.scrollY !== 0) {
        header.value?.classList.add("header-sticky", "border-b-2", "border-blue-700");
        header.value?.classList.remove("surface-border")
        filler.value?.classList.remove("hidden")
    } else {
        header.value?.classList.remove("header-sticky", "border-b-2", "border-blue-700");
        header.value?.classList.add("surface-border")
        filler.value?.classList.add("hidden")
    }
}
update();
useEventListener(document, "scroll", () => update());
const appname = import.meta.env.VITE_APP_NAME;

</script>

<template>
    <div ref="filler" class="filler p-66 border-b-2 border-blue-800 hidden">
        <div class="p-6"></div>
    </div>
    <div ref="header"
        class="flex w-full z-10 items-center justify-between gap-5 p-6 duration-1000 transition-colors bg-zinc-900 border-blue-700 border-b-2">
        <h3 class="ml-1 font-semibold">{{ appname }}</h3>
        <div class="flex gap-2">
            <Button as="a" href="https://github.com/Battlesquid/qnaplus" target="_blank" class="header-btn"
                icon="pi pi-github" aria-label="Github" outlined />
            <Button class="header-btn" icon="pi pi-cog" aria-label="Settings" outlined />
            <Button class="header-btn" icon="pi pi-info-circle" aria-label="About" outlined />
        </div>
    </div>
</template>

<style scoped>
.header-sticky {
    position: fixed;
    top: 0;
}

.header-btn {
    width: 32px !important;
    height: 32px !important;
}
</style>
