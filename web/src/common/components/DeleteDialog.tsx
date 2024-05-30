import { Button } from '@/lib/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/lib/components/ui/dialog'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onDelete: () => void
    type: string
    name: string
}

export function DeleteDialog(props: Props) {
    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm delete</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{` ${props.type} `}
                        <span className={'font-semibold'}>{props.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => props.onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant={'destructive'} onClick={props.onDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
