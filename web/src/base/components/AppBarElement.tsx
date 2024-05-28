import { Route } from '@/base/components/AppBar.tsx'
import { Link } from '@tanstack/react-router'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/lib/components/ui/tooltip.tsx'
import { useMediaQuery } from '@uidotdev/usehooks'

type AppBarIconProps = {
    route: Route
}
export const AppBarElement = (props: AppBarIconProps) => {
    const { route } = props

    const isMobile = useMediaQuery('only screen and (max-width : 767px)')

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger>
                    <Link
                        className="appbar-element"
                        to={route.route}
                        activeProps={{
                            className: 'bg-accent',
                        }}
                    >
                        {route.icon}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side={isMobile ? 'top' : 'right'}>
                    <p>{route.tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
