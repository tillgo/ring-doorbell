import { createFileRoute } from '@tanstack/react-router'
import { DeviceSelect } from '@/common/components/DeviceSelect.tsx'
import { useFetchMyDevicesQuery } from '@/base/api/hooks/useFetchMyDevicesQuery.ts'
import { useEffect, useState } from 'react'
import { Label } from '@/lib/components/ui/label.tsx'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/lib/components/ui/card.tsx'
import { DeviceItem } from '@/common/components/DeviceItem.tsx'
import {
    AddHouseholdMemberDialog,
    HouseholdMemberData,
} from '@/common/components/AddHouseholdMemberDialog.tsx'

export const Route = createFileRoute('/admin-controls')({
    component: AdminControls,
})

function AdminControls() {
    const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined)
    const { data: devices = [] } = useFetchMyDevicesQuery()

    // automatically set the selected device if there is only one
    useEffect(() => {
        if (devices.length === 1) {
            setSelectedDevice(devices[0].id)
        }
    }, [devices])

    const handleAddHouseholdMember = (value: HouseholdMemberData) => {
        console.log(value)
    }

    const handleDeviceChange = (value: string) => {
        setSelectedDevice(value)
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold">Admin Controls</h1>

            <div className={'w-full max-w-md space-y-1'}>
                <Label>Device</Label>
                <DeviceSelect onChange={handleDeviceChange} value={selectedDevice} />
            </div>

            {selectedDevice && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Household Members</CardTitle>
                            <CardDescription>
                                Manage the other members of your household, that shall have access
                                to your device.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <AddHouseholdMemberDialog onChange={handleAddHouseholdMember} />
                            {devices.map((device) => (
                                <DeviceItem key={device.id} device={device} />
                            ))}
                            {devices.length === 0 && (
                                <span className="text-muted-foreground">
                                    No connected devices found
                                </span>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Visitors</CardTitle>
                            <CardDescription>
                                Manage the visitors that have registered with your door bell.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {devices.map((device) => (
                                <DeviceItem key={device.id} device={device} />
                            ))}
                            {devices.length === 0 && (
                                <span className="text-muted-foreground">
                                    No connected devices found
                                </span>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {!selectedDevice && (
                <p className={'text-sm text-muted-foreground'}>
                    Select the device, you want to make changes to
                </p>
            )}
        </div>
    )
}
