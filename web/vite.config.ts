import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        TanStackRouterVite(),
        tsconfigPaths({
            loose: true,
        }),
        VitePWA({
            injectRegister: 'auto',
            strategies: 'injectManifest',
            base: '/',
            srcDir: 'src',
            filename: 'notifications-sw.ts',

            injectManifest: {
                minify: false,
                enableWorkboxModulesLogs: true,
            },

            registerType: 'autoUpdate',
            includeAssets: [
                'icon.svg',
                'icon-32.png',
                'icon-512.png',
                'icon-180.png',
                'icon-192.png',
            ],
            manifest: {
                name: 'Ring Doorbell',
                short_name: 'Ring Doorbell',
                description: 'Ring Doorbell app',
                theme_color: '#131313',
                icons: [
                    {
                        src: 'icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    define: {
        global: {},
    },
})
