<script setup lang="ts">
import { provide, ref } from 'vue';
import { database, getDatabaseReady, getAppData, QnaplusAppData } from "./database"
import { loadMinisearch } from "./composable/useSearch"

const loading = ref<boolean>(true);
const appdata = ref<QnaplusAppData>();
provide("appdata", appdata);

Promise.resolve()
    .then(() => getDatabaseReady())
    .then(async () => {
        const data = await getAppData();
        appdata.value = data;
    })
    .then(async () => {
        const questions = await database.questions.toArray();
        return loadMinisearch(questions);
    })
    .catch(e => console.error(e))
    .finally(() => loading.value = false);
</script>

<template>
    <div class="flex flex-column w-full h-screen">
        <div v-if="loading">
            loading!!1
        </div>
        <div v-else>
            <router-view class="w-full"></router-view>
        </div>
    </div>
</template>

<style lang="scss">
@import "styles";
</style>
