import { Moon, Sun, SunMoon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/common/hooks/useTheme'

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    const handleClick = () => {
        if (theme === 'light') {
            setTheme('dark')
        } else if (theme === 'dark') {
            setTheme('system')
        } else {
            setTheme('light')
        }
    }

    return (
        <Button variant="outline" size="icon" onClick={handleClick}>
            {theme === 'light' && <Sun className={'h-4 w-4'} />}
            {theme === 'dark' && <Moon className={'h-4 w-4'} />}
            {theme === 'system' && <SunMoon className={'h-4 w-4'} />}
        </Button>
    )
}
