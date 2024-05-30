import { useFetchMyDevicesQuery } from '@/base/api/hooks/useFetchMyDevicesQuery.ts'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/lib/components/ui/select.tsx'

export const DeviceSelect = ({
    onChange,
    value,
}: {
    onChange: (value: string) => void
    value: string | undefined
}) => {
    const { data: devices = [] } = useFetchMyDevicesQuery()

    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a device" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {devices.map((device) => (
                        <SelectItem key={device.id} value={device.id}>
                            {device.nickname}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
