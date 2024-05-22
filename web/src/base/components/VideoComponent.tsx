import { LegacyRef } from 'react'
import { Unplug } from 'lucide-react'

type VideoComponentProps = {
    isCallRunning: boolean
    myVideo: LegacyRef<HTMLVideoElement>
    userVideo: LegacyRef<HTMLVideoElement>
}

export const VideoComponent = (props: VideoComponentProps) => {
    const { isCallRunning, myVideo, userVideo } = props

    return (
        <div
            className={
                'relative mb-2 flex min-h-[80vh] min-w-[60rem] items-center justify-center border-4 border-solid border-secondary'
            }
        >
            {isCallRunning ? (
                <video className={'w-full'} playsInline ref={userVideo} autoPlay />
            ) : (
                <Unplug className={'h-28 w-28'} />
            )}
            <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className={'absolute bottom-0 right-0 w-1/4'}
            />
        </div>
    )
}
