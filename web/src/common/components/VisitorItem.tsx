import { ApiVisitor } from '@/common/types/api-types.ts'
import { BadgeCheck, User2 } from 'lucide-react'
import { DeleteDialog } from '@/common/components/DeleteDialog.tsx'
import { useDeleteVisitorMutation } from '@/base/api/hooks/useDeleteVisitorMutation.ts'
import { EditVisitorDialog } from '@/common/components/EditVisitorDialog.tsx'
import { EditVisitorData } from '@/shared/types.ts'
import { useEditVisitorMutation } from '@/base/api/hooks/useEditVisitorMutation.ts'
import { dateToXMagnitudeAgo } from '@/common/utils/dateUtils.ts'

type Props = {
    visitor: ApiVisitor
}

export const VisitorItem = (props: Props) => {
    const { mutate: deleteVisitor } = useDeleteVisitorMutation()
    const { mutate: editVisitor } = useEditVisitorMutation()

    const handleDelete = async () => {
        deleteVisitor({
            deviceId: props.visitor.deviceId,
            visitorId: props.visitor.id,
        })
    }

    const handleEdit = async (data: EditVisitorData) => {
        editVisitor({
            deviceId: props.visitor.deviceId,
            visitorId: props.visitor.id,
            ...data,
        })
    }

    return (
        <div className="flex items-center gap-4 rounded-md border px-3 py-2">
            <User2 />
            <div className="flex flex-1 gap-1">
                <p className="font-semibold">{props.visitor.nickname ?? 'Unknown Visitor'}</p>
                {!props.visitor.nickname && (
                    <p>(first visited {dateToXMagnitudeAgo(props.visitor.createdAt)})</p>
                )}

                {props.visitor.isWhitelisted && <BadgeCheck className={'text-success'} />}
            </div>

            <div className={'flex gap-2'}>
                <EditVisitorDialog
                    onEdit={handleEdit}
                    defaultValues={{
                        nickname: props.visitor.nickname ?? '',
                        isWhitelisted: props.visitor.isWhitelisted,
                    }}
                />
                <DeleteDialog
                    onDelete={handleDelete}
                    type={'visitor'}
                    name={props.visitor.nickname ?? 'Unknown Visitor'}
                />
            </div>
        </div>
    )
}
