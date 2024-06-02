import { Button } from '@/lib/components/ui/button.tsx'
import { Phone, Video, VideoOff } from 'lucide-react'
import { ChangeEvent } from 'react'

export type CallControllerControllsProps = {
    isVideoOn: boolean
    isCallRunning: boolean
    id: string
    onEnableVideo: () => void
    onDisableVideo: () => void
    onStartCall: () => void
    onEndCall: () => void
    onIdInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const VideoCallControls = (props: CallControllerControllsProps) => {
    const { isVideoOn, onEnableVideo, onDisableVideo, onEndCall } = props

    return (
        <div className={'flex justify-center gap-6 p-4'}>
            {isVideoOn ? (
                <Button
                    className={'h-14 w-14'}
                    variant={'outline'}
                    size={'icon'}
                    onClick={onDisableVideo}
                >
                    <VideoOff className={'h-8 w-8'} />
                </Button>
            ) : (
                <Button
                    className={'h-14 w-14'}
                    size={'icon'}
                    variant={'outline'}
                    onClick={onEnableVideo}
                >
                    <Video className={'h-8 w-8'} />
                </Button>
            )}

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
