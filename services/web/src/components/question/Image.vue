<script setup lang="ts">
import Image from 'primevue/image';

defineProps<{
    src: string;
    height: number;
    preview: boolean;
}>();
</script>

<template>
    <div>
        <Image :src="src" :height="height" :preview="preview" />
    </div>
</template>
