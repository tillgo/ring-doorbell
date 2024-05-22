import { createRootRoute, Outlet, useMatchRoute, useNavigate } from '@tanstack/react-router'
import { AppBar, Routes } from '@/base/components/AppBar.tsx'
import { CallControllerDrawer } from '@/base/components/CallControllerDrawer.tsx'
import useAuth from '@/common/hooks/useAuth.ts'
import { clsx } from 'clsx'
import { useEffect } from 'react'
import { LayoutDashboard, Shield, Settings } from 'lucide-react'

const routes: Routes = [
    {
        tooltip: 'Dashboard',
        route: '/',
        icon: <LayoutDashboard className={'h-8 w-8'} />,
    },
    {
        tooltip: 'Admin-Controls',
        route: 'admin',
        icon: <Shield className={'h-8 w-8'} />,
    },
    {
        tooltip: 'Settings',
        route: 'settings',
        icon: <Settings className={'h-8 w-8'} />,
    },
]

export const Route = createRootRoute({
    component: Main,
})

function Main() {
    const { isAuthenticated } = useAuth()
    const matchRoute = useMatchRoute()
    const navigate = useNavigate()

    useEffect(() => {
        if (
            !isAuthenticated &&
            !matchRoute({ to: '/login', pending: true }) &&
            !matchRoute({ to: '/sign-up', pending: true })
        ) {
            navigate({ to: '/login', params: {} }).catch((error) => console.error(error))
        }
    }, [isAuthenticated, matchRoute, navigate])

    return (
        <>
            <main className={clsx('', { 'h-full w-full pb-16 md:pb-0 md:pl-16': isAuthenticated })}>
                <Outlet />
            </main>

            {isAuthenticated && (
                <>
                    <CallControllerDrawer />
                    <AppBar routes={routes} />
                </>
            )}

            {/*<TanStackRouterDevtools position={'top-right'} />*/}
        </>
    )
}
