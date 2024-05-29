import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/lib/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/lib/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/popover'
import { FormControl, FormItem, FormLabel, FormMessage } from '@/lib/components/ui/form.tsx'
import { useFetchUsersQuery } from '@/base/api/hooks/useFetchUsersQuery.ts'
import { FieldPath, FieldValues } from 'react-hook-form'
import { ControllerRenderProps } from 'react-hook-form'
import { useMyUserQuery } from '@/base/api/hooks/useMyUserQuery.ts'
import { useMemo, useState } from 'react'

export function UserComboboxField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    field,
    showSelf = false,
}: {
    field: ControllerRenderProps<TFieldValues, TName>
    showSelf?: boolean
}) {
    const [open, setOpen] = useState(false)

    const { data = [] } = useFetchUsersQuery()
    const { data: me } = useMyUserQuery()

    const users = useMemo(
        () => (showSelf ? data : data.filter((user) => user.id !== me?.id)),
        [data, me?.id, showSelf]
    )

    return (
        <FormItem className="flex flex-col">
            <FormLabel>User</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground'
                            )}
                        >
                            {field.value
                                ? users.find((user) => user.id === field.value)?.username
                                : 'Select user'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup>
                            {users.map((user) => (
                                <CommandItem
                                    value={user.id}
                                    key={user.id}
                                    onSelect={() => {
                                        field.onChange(user.id)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            user.id === field.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {user.username}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    )
}
