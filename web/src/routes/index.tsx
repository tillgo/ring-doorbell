import { createFileRoute, Link } from '@tanstack/react-router'
import { useAppDispatch } from '@/base/appContext.tsx'
import { Button } from '@/lib/components/ui/button.tsx'
import { DeviceStatus } from '@/common/components/DeviceStatus.tsx'
import { useFetchDashboardDataQuery } from '@/base/api/hooks/useFetchDashboardDataQuery.ts'
import { Loader2 } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/lib/components/ui/card.tsx'
import { HistoryItem } from '@/common/components/HistoryItem.tsx'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const { data: dashboardData, isLoading } = useFetchDashboardDataQuery()

    const dispatch = useAppDispatch()

    const onOpenDrawer = () => {
        dispatch({ type: 'updateCallControllerOpen', payload: true })
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold">Dashboard</h1>

            <Button onClick={onOpenDrawer}>Open Drawer</Button>

            {isLoading && (
                <div className={'flex w-full justify-center'}>
                    <Loader2 className={'animate-spin'} />
                </div>
            )}

            {dashboardData && dashboardData.devices.length >= 1 && (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {dashboardData.devices.map((device) => (
                            <DeviceStatus key={device.id} device={device} />
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>History</CardTitle>
                            <CardDescription>
                                View the history of past activities on your door bells.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {dashboardData.history.map((historyLog) => (
                                <HistoryItem key={historyLog.id} historyLog={historyLog} />
                            ))}
                        </CardContent>
                    </Card>
                </>
            )}

            {dashboardData && dashboardData.devices.length === 0 && (
                <p className={'text-sm text-muted-foreground'}>
                    No devices found. If you haven't registered your device yet, you can do that in
                    the{' '}
                    <Link to={'/settings'} className={'underline'}>
                        Settings
                    </Link>
                    . If the device is owned by someone else, they can add you as a household member
                    to give you access.
                </p>
            )}
        </div>
    )
}
