import { ThemeProvider } from '@/components/theme-provider.tsx'

function App() {

    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <></>
        </ThemeProvider>
    )
}

export default App
