import { ApiHistoryLog } from '@/common/types/api-types.ts'
import { ReactNode } from 'react'
import { HistoryLogType } from '@/shared/types.ts'
import { BellElectric, BellRing, Clock, PhoneCall, PhoneOff } from 'lucide-react'
import { Badge } from '@/lib/components/ui/badge.tsx'
import { useFetchVisitorQuery } from '@/base/api/hooks/useFetchVisitorQuery.ts'
import { dateToXMagnitudeAgo } from '@/common/utils/dateUtils.ts'

const iconMap: Record<HistoryLogType, ReactNode> = {
    BELL_RING: <BellRing className={'text-foreground'} />,
    CALL_START: <PhoneCall className={'text-success'} />,
    CALL_END: <PhoneOff className={'text-destructive'} />,
}

export const HistoryItem = ({ historyLog }: { historyLog: ApiHistoryLog<HistoryLogType> }) => {
    return (
        <div className={'flex w-full flex-wrap items-center gap-4 rounded-md border p-3'}>
            {iconMap[historyLog.type]}

            {isType(historyLog, 'BELL_RING') && <BellRingRenderer historyLog={historyLog} />}

            <div className={'ml-auto flex flex-wrap gap-2'}>
                <Badge className={'gap-2'} variant={'secondary'}>
                    <Clock />
                    {dateToXMagnitudeAgo(historyLog.timestamp)}
                </Badge>

                <Badge className={'gap-2'}>
                    <BellElectric />
                    {historyLog.device.nickname ?? historyLog.device.identifier}
                </Badge>
            </div>
        </div>
    )
}

const BellRingRenderer = ({ historyLog }: { historyLog: ApiHistoryLog<'BELL_RING'> }) => {
    const { data: visitor } = useFetchVisitorQuery(historyLog.payload.visitorId)

    return (
        <p>
            <span className={'font-semibold'}>{visitor?.nickname ?? 'Unknown Visitor'}</span>
            {` rang on the door`}
        </p>
    )
}

function isType<T extends HistoryLogType>(
    historyLog: ApiHistoryLog,
    type: T
): historyLog is ApiHistoryLog<T> {
    return historyLog.type === type
}
