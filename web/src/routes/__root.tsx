import { createRootRoute, Outlet, useMatchRoute, useNavigate } from '@tanstack/react-router'
import { AppBar, Routes } from '@/base/components/AppBar.tsx'
import { VideoCallPage } from '@/base/components/VideoCallPage.tsx'
import useAuth from '@/common/hooks/useAuth.ts'
import { useEffect } from 'react'
import { LayoutDashboard, Shield, Settings } from 'lucide-react'
import { ReceiveCallDialog } from '@/base/components/ReceiveCallDialog.tsx'
import { cn } from '@/lib/utils.ts'

const routes: Routes = [
    {
        tooltip: 'Dashboard',
        route: '/',
        icon: <LayoutDashboard className={'h-8 w-8'} />,
    },
    {
        tooltip: 'Admin Controls',
        route: 'admin-controls',
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
    const { isAuthenticated, userId } = useAuth()
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
            <main
                className={cn('min-h-dvh w-full bg-muted/40 p-4 md:p-8', {
                    'pb-20 md:pb-8 md:pl-24': isAuthenticated,
                })}
            >
                <div className="mx-auto h-full w-full max-w-4xl">
                    <Outlet />
                </div>
            </main>

            {isAuthenticated && userId && (
                <>
                    <VideoCallPage userId={userId} />
                    <AppBar routes={routes} />
                    <ReceiveCallDialog />
                </>
            )}

            {/*<TanStackRouterDevtools position={'top-right'} />*/}
        </>
    )
}
