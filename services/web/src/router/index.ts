import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

import Search from "./Search.vue";
import Question from "./Question.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: Search
    },
    {
        path: "/:id",
        component: Question
    }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
});
