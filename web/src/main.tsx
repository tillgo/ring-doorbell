import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { AppContextProvider } from '@/base/appContext.tsx'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <AppContextProvider>
                    <RouterProvider router={router} />
                </AppContextProvider>
            </ThemeProvider>
        </StrictMode>
    )
}
