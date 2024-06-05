import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ThemeProvider } from '@/base/ThemeProvider.tsx'
import { AppContextProvider } from '@/base/appContext.tsx'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen.ts'
import '@tanstack/react-query'
import { AxiosError } from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const router = createRouter({ routeTree })
const queryClient = new QueryClient()

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: AxiosError<{ message: string }>
    }
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <AppContextProvider>
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={router} />
                    </QueryClientProvider>
                </AppContextProvider>
            </ThemeProvider>
        </StrictMode>
    )
}
