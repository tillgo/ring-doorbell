import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/lib/components/ui/form.tsx'
import { UserComboboxField } from '@/common/components/UserComboboxField.tsx'
import { AddHouseholdMemberData, AddHouseholdMemberSchema } from '@/shared/types.ts'
import { Input } from '@/lib/components/ui/input.tsx'
import { Button } from '@/lib/components/ui/button.tsx'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/lib/components/ui/dialog.tsx'
import { useState } from 'react'
import { Plus } from 'lucide-react'

export type HouseholdMemberData = Omit<AddHouseholdMemberData, 'deviceId'>

export const AddHouseholdMemberDialog = ({
    onChange,
}: {
    onChange: (data: HouseholdMemberData) => void
}) => {
    const [open, setOpen] = useState(false)
    const form = useForm<HouseholdMemberData>({
        mode: 'onSubmit',
        resolver: zodResolver(AddHouseholdMemberSchema.omit({ deviceId: true })),
        defaultValues: {
            userId: '',
            nickname: '',
        },
    })

    const onSubmit: SubmitHandler<HouseholdMemberData> = async (formData) => {
        onChange({
            ...formData,
            nickname: formData.nickname ? formData.nickname.trim() : undefined,
        })

        form.reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Register a new member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                    <DialogDescription>
                        Add a new member to your household. They will be able to access your device.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <UserComboboxField<HouseholdMemberData, 'userId'> field={field} />
                            )}
                        />
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

                        <DialogFooter>
                            <Button type="submit">Add Member</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
