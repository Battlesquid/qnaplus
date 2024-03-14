import PrimeVue from "primevue/config";
import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";

createApp(App)
    .use(PrimeVue)
    .use(router)
    .mount("#app");
