import { createFileRoute } from '@tanstack/react-router'
import { useAppDispatch } from '@/base/appContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ModeToggle } from '@/components/mode-toggle.tsx'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const dispatch = useAppDispatch()

    const onOpenDrawer = () => {
        console.log('Test')
        dispatch({ type: 'updateCallControllerOpen', payload: true })
    }

    return (
        <div className="p-2 flex">
            <h3>Welcome Home!</h3>
            <Button onClick={onOpenDrawer}>Open Drawer</Button>
            <ModeToggle />
        </div>
    )
}
