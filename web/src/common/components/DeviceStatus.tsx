import { BellElectric, Wifi, WifiOff } from 'lucide-react'
import { ApiDeviceWithStatus } from '@/common/types/api-types.ts'
import { useMyUserQuery } from '@/base/api/hooks/useMyUserQuery.ts'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils.ts'

type Props = {
    device: ApiDeviceWithStatus
}

export const DeviceStatus = (props: Props) => {
    const { data: user } = useMyUserQuery()
    const isOwner = props.device.ownerId === user?.id

    const navigate = useNavigate()

    const handleClick = () => {
        if (isOwner) {
            navigate({ to: '/admin-controls', search: { selectedDevice: props.device.id } })
        }
    }

    return (
        <div
            className={cn('flex flex-wrap items-center gap-4 rounded-md border bg-muted p-4', {
                'cursor-pointer bg-background hover:bg-muted/20': isOwner,
            })}
            onClick={handleClick}
        >
            <BellElectric />
            <p className="font-semibold">{props.device.nickname ?? props.device.identifier}</p>

            <div className={'ml-auto'}>
                {props.device.onlineStatus ? (
                    <Wifi className={'text-success'} />
                ) : (
                    <WifiOff className={'text-destructive'} />
                )}
            </div>
        </div>
    )
}
