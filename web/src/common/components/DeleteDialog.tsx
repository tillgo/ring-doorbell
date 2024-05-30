import { Button } from '@/lib/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/lib/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

type Props = {
    onDelete: () => void
    type: string
    name: string
}

export function DeleteDialog(props: Props) {
    const [open, setOpen] = useState(false)

    const handleDelete = async () => {
        props.onDelete()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={'ghost'} size={'icon'} onClick={() => setOpen(true)}>
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm delete</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{` ${props.type} `}
                        <span className={'font-semibold'}>{props.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant={'destructive'} onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
