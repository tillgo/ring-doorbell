import { Button } from '@/lib/components/ui/button.tsx'
import { Phone } from 'lucide-react'
import { ChangeEvent } from 'react'

export type CallControllerControllsProps = {
    isCallRunning: boolean
    id: string
    onStartCall: () => void
    onEndCall: () => void
    onIdInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const VideoCallControls = (props: CallControllerControllsProps) => {
    const { onEndCall } = props

    return (
        <div className={'flex justify-center gap-6 p-4'}>
            <Button
                variant={'destructive'}
                size={'icon'}
                className={'h-14 w-14'}
                onClick={onEndCall}
            >
                <Phone className={'h-8 w-8'} />
            </Button>
        </div>
    )
}
