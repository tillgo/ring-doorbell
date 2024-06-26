import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/lib/components/ui/button.tsx'
import { handleLogout } from '@/common/utils/logout.ts'
import { BellRing, LogOut, Plus, SunMoon } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/lib/components/ui/card.tsx'
import { Switch } from '@/lib/components/ui/switch.tsx'
import { ThemeToggle } from '@/common/components/ThemeToggle.tsx'
import { useFetchMyDevicesQuery } from '@/base/api/hooks/useFetchMyDevicesQuery.ts'
import { DeviceItem } from '@/common/components/DeviceItem.tsx'

export const Route = createFileRoute('/settings')({
    component: Settings,
})

// TODO: implement push notifications
function Settings() {
    const { data: devices = [] } = useFetchMyDevicesQuery()

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Devices</CardTitle>
                    <CardDescription>Manage your door bell devices.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Link to="/settings/register-device">
                        <Button variant="secondary" className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Register a new device
                        </Button>
                    </Link>
                    {devices.map((device) => (
                        <DeviceItem key={device.id} device={device} />
                    ))}
                    {devices.length === 0 && (
                        <span className="text-muted-foreground">No connected devices found</span>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <BellRing />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">
                                Send notifications to device (e.g. when your door bell is rung).
                            </p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <SunMoon />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">Theme</p>
                            <p className="text-sm text-muted-foreground">
                                Switch between light and dark mode.
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
