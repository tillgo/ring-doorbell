import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/common/hooks/useTheme'

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    const handleClick = () => {
        if (theme === 'system') {
            setTheme(systemTheme === 'dark' ? 'light' : 'dark')
        } else if (theme === 'dark') {
            setTheme('light')
        } else {
            setTheme('dark')
        }
    }

    return (
        <Button variant="outline" size="icon" onClick={handleClick}>
            {(theme === 'light' || (theme === 'system' && systemTheme === 'light')) && (
                <Sun className={'h-4 w-4'} />
            )}
            {(theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) && (
                <Moon className={'h-4 w-4'} />
            )}
        </Button>
    )
}
