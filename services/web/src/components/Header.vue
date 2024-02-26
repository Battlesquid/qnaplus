<script setup lang="ts">
import Button from 'primevue/button';
import { onMounted, onUnmounted, ref } from 'vue';
const header = ref<HTMLDivElement | null>(null);
const filler = ref<HTMLDivElement | null>(null);
onMounted(() => {
    const update = () => {
        if (window.scrollY !== 0) {
            header.value?.classList.add("header-sticky", "border-bottom-1", "border-blue-800");
            header.value?.classList.remove("surface-border")
            filler.value?.classList.remove("hidden")
        } else {
            header.value?.classList.remove("header-sticky", "border-bottom-1", "border-blue-800");
            header.value?.classList.add("surface-border")
            filler.value?.classList.add("hidden")
        }
    }
    update();
    window.addEventListener("scroll", () => update());
})
onUnmounted(() => {
    window.removeEventListener("scroll", () => { });
})
</script>

<template>
    <div ref="filler" class="filler p-3 border-transparent border-bottom-1 hidden">
        <div class="p-3"></div>
    </div>
    <div ref="header"
        class="flex w-full surface-card z-5 align-items-center justify-content-between gap-2 p-2 transition-duration-1000 transition-colors">
        <div class="p-3">qnaplus</div>
        <div class="flex gap-2">
            <a href="https://github.com/Battlesquid/qnaplus" target="_blank">
                <Button class="w-2rem h-2rem" icon="pi pi-github" aria-label="Github" outlined />
            </a>
            <Button class="w-2rem h-2rem" icon="pi pi-cog" aria-label="Settings" outlined />
            <Button class="w-2rem h-2rem" icon="pi pi-info-circle" aria-label="About" outlined />
        </div>
    </div>
</template>

<style scoped>
.header-sticky {
    position: fixed;
    top: 0;
}
</style>
