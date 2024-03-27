import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

import Search from "./Search.vue";

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
