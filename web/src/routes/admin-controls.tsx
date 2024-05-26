import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-controls')({
    component: AdminControls,
})

function AdminControls() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold">Admin Controls</h1>
        </div>
    )
}
