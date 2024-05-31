import { BellElectric, Wifi, WifiOff } from 'lucide-react'
import { ApiDeviceWithStatus } from '@/common/types/api-types.ts'
import { clsx } from 'clsx'
import { useMyUserQuery } from '@/base/api/hooks/useMyUserQuery.ts'

type Props = {
    device: ApiDeviceWithStatus
}

export const DeviceStatus = (props: Props) => {
    const { data: user } = useMyUserQuery()
    const isOwner = props.device.ownerId === user?.id

    const handleClick = () => {
        if (isOwner) {
            //TODO: open admin page for that device
        }
    }

    return (
        <div
            className={clsx('flex flex-wrap items-center gap-4 rounded-md border bg-muted p-4', {
                'pointer bg-background': isOwner,
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
