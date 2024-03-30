import { createRootRoute, Outlet, useMatchRoute, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AppBar, Routes } from '@/app/general/components/AppBar.tsx'
import { MdAdminPanelSettings, MdSpaceDashboard } from 'react-icons/md'
import { CallControllerDrawer } from '@/app/general/components/CallControllerDrawer.tsx'
import useAuth from '@/common/hooks/useAuth.ts'
import { clsx } from 'clsx'
import { useEffect } from 'react'

const routes: Routes = [
    {
        tooltip: 'Dashboard',
        route: '/',
        icon: <MdSpaceDashboard size={'auto'} />,
    },
    {
        tooltip: 'Admin-Controls',
        route: 'admin',
        icon: <MdAdminPanelSettings size={'auto'} />,
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
        if (!isAuthenticated && !matchRoute({ to: '/login', pending: true }) && !matchRoute({ to: '/sign-up', pending: true })) {
            navigate({ to: '/login', params: {} })
                .catch((error) => console.error(error))
        }
    }, [isAuthenticated, matchRoute, navigate])

    return (
        <main>
            <div className={clsx('', { 'mb-16 md:pl-16': isAuthenticated })}>
                <Outlet />
            </div>

            {isAuthenticated && (
                <>
                    <CallControllerDrawer />
                    <AppBar routes={routes} />
                </>
            )}

            <TanStackRouterDevtools position={'top-right'} />
        </main>
    )
}
