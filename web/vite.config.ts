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
            registerType: 'autoUpdate',
            devOptions: { enabled: true },
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
                theme_color: '???',
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
