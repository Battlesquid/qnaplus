<script setup lang="ts">
import Header from "../components/shared/Header.vue";
</script>

<template>
    <div id="app-root">
        <Header />
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
@media screen and (min-width: 576px) {
    .content {
        padding: 0;
    }
}

@media screen and (min-width: 768px) {
    .content {
        padding: 0 2rem;
    }
}

@media screen and (min-width: 992px) {
    .content {
        padding: 0 5rem;
    }
}

@media screen and (min-width: 1200px) {
    .content {
        padding: 0 20%;
    }
}
</style>
