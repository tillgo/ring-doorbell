import { createFileRoute, Link } from '@tanstack/react-router'
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
import {
    AddHouseholdMemberDialog,
    HouseholdMemberData,
} from '@/common/components/AddHouseholdMemberDialog.tsx'
import { useFetchHouseholdMembers } from '@/base/api/hooks/useFetchHouseholdMembers.ts'
import { useAddHouseholdMemberMutation } from '@/base/api/hooks/useAddHouseholdMemberMutation.ts'
import { HouseholdMemberItem } from '@/common/components/HouseholdMemberItem.tsx'
import { useFetchVisitorsQuery } from '@/base/api/hooks/useFetchVisitorsQuery.ts'
import { VisitorItem } from '@/common/components/VisitorItem.tsx'

export const Route = createFileRoute('/admin-controls')({
    component: AdminControls,
})

function AdminControls() {
    const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined)
    const { data: devices = [] } = useFetchMyDevicesQuery()
    const { data: householdMembers = [] } = useFetchHouseholdMembers({ id: selectedDevice })
    const { data: visitors = [] } = useFetchVisitorsQuery({ id: selectedDevice })

    const { mutate: addHouseholdMember } = useAddHouseholdMemberMutation()

    // automatically set the selected device if there is only one
    useEffect(() => {
        if (devices.length === 1) {
            setSelectedDevice(devices[0].id)
        }
    }, [devices])

    const handleAddHouseholdMember = (value: HouseholdMemberData) => {
        addHouseholdMember({ ...value, deviceId: selectedDevice! })
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
                            {householdMembers.map((member) => (
                                <HouseholdMemberItem key={member.user.id} member={member} />
                            ))}
                            {householdMembers.length === 0 && (
                                <span className="text-muted-foreground">
                                    No registered household members found
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
                            {visitors.map((visitor) => (
                                <VisitorItem key={visitor.id} visitor={visitor} />
                            ))}
                            {visitors.length === 0 && (
                                <span className="text-muted-foreground">
                                    No registered visitors found
                                </span>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {!selectedDevice && (
                <p className={'text-sm text-muted-foreground'}>
                    Select the device, you want to make changes to.
                    <br />
                    If you haven't registered your device yet, you can do that in the{' '}
                    <Link to={'/settings'} className={'underline'}>
                        Settings
                    </Link>
                    .
                </p>
            )}
        </div>
    )
}
