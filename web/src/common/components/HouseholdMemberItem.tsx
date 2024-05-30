import { Trash2, User2 } from 'lucide-react'
import { ApiHouseholdMember } from '@/common/types/api-types.ts'
import { Button } from '@/lib/components/ui/button.tsx'
import { useState } from 'react'
import { DeleteDialog } from '@/common/components/DeleteDialog.tsx'
import { useDeleteHouseholdMemberMutation } from '@/base/api/hooks/useDeleteHouseholdMemberMutation.ts'

type Props = {
    member: ApiHouseholdMember
}

export const HouseholdMemberItem = (props: Props) => {
    const [open, setOpen] = useState(false)

    const { mutate: deleteHouseholdMember } = useDeleteHouseholdMemberMutation()

    const handleDelete = async () => {
        deleteHouseholdMember({
            deviceId: props.member.deviceId,
            userId: props.member.userId,
        })

        setOpen(false)
    }

    return (
        <div className="flex items-center gap-4 rounded-md border p-3">
            <User2 />
            <div className="flex flex-1 gap-1">
                <p className="font-semibold">
                    {props.member.userNickname ?? props.member.user.username}
                </p>
                <p>(Username: {props.member.user.username})</p>
            </div>

            <Button variant={'ghost'} size={'icon'} onClick={() => setOpen(true)}>
                <Trash2 />
            </Button>
            <DeleteDialog
                open={open}
                onOpenChange={setOpen}
                onDelete={handleDelete}
                type={'household member'}
                name={props.member.user.username}
            />
        </div>
    )
}
