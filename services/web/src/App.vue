<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
import { provide, ref } from 'vue';
import { database, setupDatabase, getAppData, QnaplusAppData } from "./database"
import { loadMinisearch } from "./composable/useSearch"

const loading = ref<boolean>(true);
const appdata = ref<QnaplusAppData>();
provide("appdata", appdata);

const appname = import.meta.env.VITE_APP_NAME;

const startup = async () => {
    try {
        await setupDatabase();

        const data = await getAppData();
        appdata.value = data;

        const questions = await database.questions.toArray();
        await loadMinisearch(questions);

        loading.value = false
    } catch (e) {
        console.error(e);
    }
}

startup();

</script>

<template>
    <div v-if="loading" class="flex flex-row h-screen-mobile justify-center items-center gap-x-4">
        <h3>{{ appname }}</h3>
        <ProgressSpinner class="w-8 h-8 m-0" strokeWidth="6" fill="transparent" animationDuration="0.5s" />
    </div>
    <div v-else class="flex flex-column w-full h-screen">
        <Suspense>
            <router-view class="w-full"></router-view>
        </Suspense>
    </div>
</template>

<style>
@import "styles";
</style>
