import { useEffect, useRef } from 'react'
import {
    VideoCallControls,
    CallControllerControllsProps,
} from '@/base/components/VideoCallControls.tsx'

type VideoComponentProps = {
    isCallRunning: boolean
    myVideoStream: MediaStream | undefined
    userVideoStream: MediaStream | undefined
}

export const VideoComponent = (props: VideoComponentProps & CallControllerControllsProps) => {
    const { myVideoStream, userVideoStream } = props

    const myVideo = useRef<HTMLVideoElement>(null)
    const userVideo = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (myVideo.current) {
            myVideo.current.srcObject = myVideoStream ?? null
        }
        if (userVideo.current) {
            userVideo.current.srcObject = userVideoStream ?? null
        }
    }, [myVideoStream, userVideoStream])

    return (
        <div className={'grid h-full w-full grid-cols-1 grid-rows-[calc(100dvh-88px)_88px]'}>
            <div className="h-full w-full">
                <video
                    className={'h-full w-full rounded-xl object-contain'}
                    ref={myVideo}
                    autoPlay
                />
                <div className={'absolute right-2 top-2 w-1/3 md:w-1/4'}>
                    <video className={'rounded-xl'} muted ref={null} autoPlay />
                </div>
            </div>

            <VideoCallControls {...props} />
        </div>
    )
}
