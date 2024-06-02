import { BellElectric } from 'lucide-react'
import { ApiDevice } from '@/common/types/api-types.ts'

type Props = {
    device: ApiDevice
}

export const DeviceItem = (props: Props) => (
    <div className="flex items-center gap-4 rounded-md border p-3">
        <BellElectric />
        <div className="flex flex-wrap gap-1">
            <p className="font-semibold">{props.device.nickname}</p>
            <p>(UID: {props.device.identifier})</p>
        </div>
    </div>
)
