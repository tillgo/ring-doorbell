import { Device } from '@/shared/types.ts'
import { BellElectric } from 'lucide-react'

type Props = {
    device: Device
}

export const DeviceItem = (props: Props) => (
    <div className="flex items-center gap-4 rounded-md border p-3">
        <BellElectric />
        <div className="flex gap-1">
            <p className="font-semibold">{props.device.nickname}</p>
            <p>(UID: {props.device.identifier})</p>
        </div>
    </div>
)
