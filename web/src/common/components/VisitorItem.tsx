import { ApiVisitor } from '@/common/types/api-types.ts'
import { Trash2, User2 } from 'lucide-react'
import { Button } from '@/lib/components/ui/button.tsx'
import { DeleteDialog } from '@/common/components/DeleteDialog.tsx'
import { useState } from 'react'
import { useDeleteVisitorMutation } from '@/base/api/hooks/useDeleteVisitorMutation.ts'

type Props = {
    visitor: ApiVisitor
}

export const VisitorItem = (props: Props) => {
    const [open, setOpen] = useState(false)

    const { mutate: deleteVisitor } = useDeleteVisitorMutation()

    const handleDelete = async () => {
        deleteVisitor({
            deviceId: props.visitor.deviceId,
            visitorId: props.visitor.id,
        })

        setOpen(false)
    }

    return (
        <div className="flex items-center gap-4 rounded-md border px-3 py-2">
            <User2 />
            <div className="flex flex-1 gap-1">
                <p className="font-semibold">{props.visitor.nickname ?? props.visitor.name}</p>
                <p>(Name: {props.visitor.name})</p>
            </div>

            <Button variant={'ghost'} size={'icon'} onClick={() => setOpen(true)}>
                <Trash2 />
            </Button>
            <DeleteDialog
                open={open}
                onOpenChange={setOpen}
                onDelete={handleDelete}
                type={'visitor'}
                name={props.visitor.nickname ?? props.visitor.name}
            />
        </div>
    )
}
