import { User2 } from 'lucide-react'
import { ApiHouseholdMember } from '@/common/types/api-types.ts'
import { DeleteDialog } from '@/common/components/DeleteDialog.tsx'
import { useDeleteHouseholdMemberMutation } from '@/base/api/hooks/useDeleteHouseholdMemberMutation.ts'

type Props = {
    member: ApiHouseholdMember
}

export const HouseholdMemberItem = (props: Props) => {
    const { mutate: deleteHouseholdMember } = useDeleteHouseholdMemberMutation()

    const handleDelete = async () => {
        deleteHouseholdMember({
            deviceId: props.member.deviceId,
            userId: props.member.userId,
        })
    }

    return (
        <div className="flex flex-wrap items-center gap-4 rounded-md border px-3 py-2">
            <User2 />
            <div className="flex flex-wrap gap-1">
                <p className="font-semibold">
                    {props.member.userNickname ?? props.member.user.username}
                </p>
                <p>(Username: {props.member.user.username})</p>
            </div>

            <div className={'ml-auto'}>
                <DeleteDialog
                    onDelete={handleDelete}
                    type={'household member'}
                    name={props.member.userNickname ?? props.member.user.username}
                />
            </div>
        </div>
    )
}
