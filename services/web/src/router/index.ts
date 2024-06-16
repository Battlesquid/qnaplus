import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

import { loadSearchResources } from "../composable/useSearch";
import { onDatabaseReady } from "../database";
import Search from "./Search.vue";

onDatabaseReady(() => {
    loadSearchResources();
});

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: Search
    }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
});
