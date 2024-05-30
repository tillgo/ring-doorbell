import { User2 } from 'lucide-react'
import { ApiHouseholdMember } from '@/common/types/api-types.ts'

type Props = {
    member: ApiHouseholdMember
}

export const HouseholdMemberItem = (props: Props) => (
    <div className="flex items-center gap-4 rounded-md border p-3">
        <User2 />
        <div className="flex gap-1">
            <p className="font-semibold">
                {props.member.userNickname ?? props.member.user.username}
            </p>
            <p>(Username: {props.member.user.username})</p>
        </div>
    </div>
)
