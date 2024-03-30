import { AppBarElement } from '@/app/general/components/AppBarElement.tsx'
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
        <div className={'mobile-appbar md:desktop-appbar flex bg-secondary'}>
            {routes.map((route, index) => {
                return <AppBarElement key={index} route={route} />
            })}
        </div>
    )
}