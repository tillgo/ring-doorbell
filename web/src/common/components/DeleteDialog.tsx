import { Button } from '@/lib/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/lib/components/ui/alert-dialog.tsx'

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
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={'ghost'} size={'icon'} onClick={() => setOpen(true)}>
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm delete</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{` ${props.type} `}
                        <span className={'font-semibold'}>{props.name}</span>?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant={'destructive'} onClick={handleDelete}>
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
