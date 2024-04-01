import { createFileRoute } from '@tanstack/react-router'
import { useAppDispatch } from '@/base/appContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ModeToggle } from '@/components/mode-toggle.tsx'
import { useQuery } from '@tanstack/react-query'
import { fetchMyUser } from '@/common/api/queries/users.ts'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const dispatch = useAppDispatch()

    const { data } = useQuery({ queryKey: ['me'], queryFn: fetchMyUser })

    const onOpenDrawer = () => {
        console.log('Test')
        dispatch({ type: 'updateCallControllerOpen', payload: true })
    }

    return (
        <div className="flex p-2">
            <h3>Welcome {data?.username ?? '-'}!</h3>
            <Button onClick={onOpenDrawer}>Open Drawer</Button>
            <ModeToggle />
        </div>
    )
}
