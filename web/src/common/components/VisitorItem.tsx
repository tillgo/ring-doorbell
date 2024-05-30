import { ApiVisitor } from '@/common/types/api-types.ts'
import { User2 } from 'lucide-react'

type Props = {
    visitor: ApiVisitor
}

export const VisitorItem = (props: Props) => (
    <div className="flex items-center gap-4 rounded-md border p-3">
        <User2 />
        <div className="flex gap-1">
            <p className="font-semibold">{props.visitor.nickname ?? props.visitor.name}</p>
            <p>(Name: {props.visitor.name})</p>
        </div>
    </div>
)
