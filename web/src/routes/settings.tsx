import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
    component: Settings,
})

function Settings() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
    )
}
