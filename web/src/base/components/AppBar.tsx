import { AppBarElement } from '@/base/components/AppBarElement.tsx'
import { JSX } from 'react'

export type Route = {
    tooltip: string
    route: string
    icon: JSX.Element
}

export type Routes = Route[]

type AppBarProps = {
    routes: Routes
}

export const AppBar = (props: AppBarProps) => {
    const { routes } = props

    return (
        <nav className={'mobile-appbar md:desktop-appbar z-10 flex bg-background'}>
            {routes.map((route, index) => {
                return <AppBarElement key={index} route={route} />
            })}
        </nav>
    )
}
