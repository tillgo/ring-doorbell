import { createFileRoute } from '@tanstack/react-router'
import { useAppDispatch } from '@/base/appContext.tsx'
import { Button } from '@/lib/components/ui/button.tsx'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const dispatch = useAppDispatch()

    const onOpenDrawer = () => {
        dispatch({ type: 'updateCallControllerOpen', payload: true })
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <Button onClick={onOpenDrawer}>Open Drawer</Button>
        </div>
    )
}
