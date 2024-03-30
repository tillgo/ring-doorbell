import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AppBar, Routes } from '@/app/general/components/AppBar.tsx'
import { MdAdminPanelSettings, MdSpaceDashboard } from 'react-icons/md'
import { CallControllerDrawer } from '@/app/general/components/CallControllerDrawer.tsx'

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
    component: () => (
        <>
            <div className="mb-16 md:pl-16">
                <Outlet />
            </div>
            <CallControllerDrawer></CallControllerDrawer>
            <AppBar routes={routes}></AppBar>
            <TanStackRouterDevtools position={'top-right'} />
        </>
    ),
})
