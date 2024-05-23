import { Button } from '@/lib/components/ui/button.tsx'
import { Phone, PhoneOff, Video, VideoOff } from 'lucide-react'
import { Input } from '@/lib/components/ui/input.tsx'
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

export const CallControllerControlls = (props: CallControllerControllsProps) => {
    const {
        isVideoOn,
        isCallRunning,
        id,
        onEnableVideo,
        onDisableVideo,
        onStartCall,
        onEndCall,
        onIdInputChange,
    } = props

    return (
        <div className={'mt-5 flex justify-center space-x-5 rounded-xl bg-background p-3'}>
            {isVideoOn ? (
                <Button
                    className={'h-20 w-20 rounded-xl border-none bg-transparent bg-opacity-30'}
                    variant={'outline'}
                    onClick={onDisableVideo}
                >
                    <VideoOff className={'h-20 w-20  bg-transparent'} />
                </Button>
            ) : (
                <Button
                    className={'h-20 w-20 rounded-xl border-none bg-transparent bg-opacity-30'}
                    variant={'outline'}
                    onClick={onEnableVideo}
                >
                    <Video className={'h-20 w-20  bg-transparent'} />
                </Button>
            )}

            {isCallRunning ? (
                <Button
                    variant={'outline'}
                    size={'icon'}
                    className={'h-20 w-20 rounded-xl border-none bg-transparent bg-opacity-30'}
                    onClick={onEndCall}
                >
                    <PhoneOff className={'h-10 w-10  bg-transparent'} />
                </Button>
            ) : (
                <Button
                    variant={'outline'}
                    size={'icon'}
                    className={'h-20 w-20 rounded-xl border-none bg-transparent bg-opacity-30'}
                    onClick={onStartCall}
                >
                    <Phone className={'h-10 w-10  bg-transparent'} />
                </Button>
            )}
            <div className={'flex flex-col justify-end'}>
                <h3 className={'mb-2'}>{id}</h3>
                <Input
                    id={'id-field'}
                    className={'w-30'}
                    placeholder={'user-id to call'}
                    onChange={onIdInputChange}
                />
            </div>
        </div>
    )
}
