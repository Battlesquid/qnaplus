<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import Button from 'primevue/button';
import { ref } from 'vue';
const header = ref<HTMLDivElement | null>(null);
const filler = ref<HTMLDivElement | null>(null);
const update = () => {
    if (window.scrollY !== 0) {
        header.value?.classList.add("header-sticky", "border-b-1", "border-surface-600");
        header.value?.classList.remove("border-surface-900")
        filler.value?.classList.remove("hidden")
    } else {
        header.value?.classList.remove("header-sticky", "border-b-1", "border-surface-600");
        header.value?.classList.add("border-surface-900")
        filler.value?.classList.add("hidden")
    }
}
update();
useEventListener(document, "scroll", () => update());
const appname = import.meta.env.VITE_APP_NAME;

</script>

<template>
    <div ref="filler" class="filler p-3 border-b-1 hidden">
        <div class="p-3"></div>
    </div>
    <div ref="header"
        class="flex w-full z-10 items-center justify-between gap-5 p-3 duration-1000 transition-colors border-surface-600 bg-surface-900 border-b-1">
        <a href="/" class="ml-1 font-semibold">{{ appname }}</a>
        <div class="flex gap-2">
            <Button as="a" href="https://github.com/Battlesquid/qnaplus" target="_blank" class="header-btn"
                icon="pi pi-github" aria-label="Github" outlined />
            <Button class="bg-surface-900 header-btn" icon="pi pi-cog" aria-label="Settings" outlined />
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

.border-b-1 {
    border-bottom-width: 1px;
}
</style>
