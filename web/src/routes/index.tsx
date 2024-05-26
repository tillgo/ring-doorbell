import { createFileRoute } from '@tanstack/react-router'
import { useAppDispatch } from '@/base/appContext.tsx'
import { Button } from '@/lib/components/ui/button.tsx'
import { ThemeToggle } from '@/common/components/ThemeToggle.tsx'
import { useQuery } from '@tanstack/react-query'
import { fetchMyUser } from '@/base/api/queries/users.ts'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const dispatch = useAppDispatch()

    const { data } = useQuery({ queryKey: ['me'], queryFn: fetchMyUser })

    const onOpenDrawer = () => {
        dispatch({ type: 'updateCallControllerOpen', payload: true })
    }

    return (
        <div className="flex">
            <h3>Welcome {data?.username ?? '-'}!</h3>
            <Button onClick={onOpenDrawer}>Open Drawer</Button>
            <ThemeToggle />
        </div>
    )
}
