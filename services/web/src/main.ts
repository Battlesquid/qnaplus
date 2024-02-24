import { createApp } from 'vue'
import "primevue/resources/themes/lara-dark-indigo/theme.css"
import PrimeVue from "primevue/config"
import App from './App.vue'
import router from "./router";


const app = createApp(App);
app.use(PrimeVue);
app.use(router)
app.mount('#app');
