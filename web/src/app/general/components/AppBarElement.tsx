import { Route } from '@/app/general/components/AppBar.tsx'
import { Link } from '@tanstack/react-router'

type AppBarIconProps = {
    route: Route
}
export const AppBarElement = (props: AppBarIconProps) => {
    const { route } = props

    return (
        <Link className="appbar-element" to={route.route}>
            {route.icon}
        </Link>
    )
}
