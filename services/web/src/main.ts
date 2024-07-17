import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura"
import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import { definePreset } from "@primevue/themes";

const preset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        }
    }
});

createApp(App)
    .use(PrimeVue, {
        // Default theme configuration
        theme: {
            preset,
            options: {
                prefix: 'p',
                darkModeSelector: 'system',
                cssLayer: false
            }
        }
    })
    .use(router)
    .mount("#app");
