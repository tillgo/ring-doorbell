import { createLazyFileRoute } from '@tanstack/react-router'
import { useAppDispatch } from '@/base/appContext.tsx'
import { Button } from '@/components/ui/button.tsx'

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    const dispatch = useAppDispatch()

    const onOpenDrawer = () => {
        dispatch({ type: 'updateCallControllerOpen', payload: true })
    }

    return (
        <div className="p-2">
            <h3>Welcome Home!</h3>
            <Button onClick={onOpenDrawer}>Open Drawer</Button>
        </div>
    )
}
