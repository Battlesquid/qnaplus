<script setup lang="ts">
import Header from "./components/Header.vue";
</script>

<template>
    <div class="flex flex-column w-full h-screen">
        <Header />
        <router-view class="w-full"></router-view>
    </div>
</template>

<style lang="scss">
@import "styles";
</style>
