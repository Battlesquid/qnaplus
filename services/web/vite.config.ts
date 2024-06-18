import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        vue(),
        VitePWA({
            registerType: 'prompt',
            injectRegister: "inline",

            pwaAssets: {
                disabled: false,
                config: true,
            },

            manifest: {
                name: 'qnaplus',
                short_name: 'qnaplus',
                description: 'Advanced search tool for the VEX Robotics Q&A',
                theme_color: '#1a1b26',
            },

            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
            },

            devOptions: {
                enabled: false,
                navigateFallback: 'index.html',
                suppressWarnings: true,
                type: 'module',
            },
        })
    ],
})
