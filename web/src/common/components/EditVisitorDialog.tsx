import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/lib/components/ui/dialog.tsx'
import { Button } from '@/lib/components/ui/button.tsx'
import { BadgeCheck, Edit } from 'lucide-react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/lib/components/ui/form.tsx'
import { Input } from '@/lib/components/ui/input.tsx'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EditVisitorData, EditVisitorSchema } from '@/shared/types.ts'
import { Switch } from '@/lib/components/ui/switch.tsx'

type Props = {
    onEdit: (value: EditVisitorData) => void
    defaultValues: EditVisitorData
}

export const EditVisitorDialog = (props: Props) => {
    const [open, setOpen] = useState(false)

    const form = useForm<EditVisitorData>({
        mode: 'onSubmit',
        resolver: zodResolver(EditVisitorSchema),
        defaultValues: props.defaultValues,
    })

    const onSubmit: SubmitHandler<EditVisitorData> = async (formData) => {
        props.onEdit(formData)

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={'ghost'} size={'icon'} onClick={() => setOpen(true)}>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Visitor</DialogTitle>
                    <DialogDescription>
                        Update Nickname for your Visitor and whitelist them to be able to enter
                        without permission.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="nickname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nickname</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isWhitelisted"
                            render={({ field }) => (
                                <FormItem
                                    className={'flex items-center rounded-md border px-4 pb-2'}
                                >
                                    <FormLabel className={'flex flex-1 items-center gap-2 pt-2'}>
                                        Whitelisted
                                        <BadgeCheck className={'text-success'} />
                                    </FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant={'default'} type={'submit'}>
                                Edit Visitor
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
