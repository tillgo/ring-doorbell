import { useEffect, useRef } from 'react'
import { Loader2, Unplug } from 'lucide-react'
import {
    CallControllerControlls,
    CallControllerControllsProps,
} from '@/base/components/CallControllerControlls.tsx'

type VideoComponentProps = {
    isCallRunning: boolean
    myVideoStream: MediaStream | undefined
    userVideoStream: MediaStream | undefined
}

export const VideoComponent = (props: VideoComponentProps & CallControllerControllsProps) => {
    const { isCallRunning, myVideoStream, userVideoStream } = props

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
        <div className={'relative mb-2 flex flex-col items-center justify-center p-2'}>
            {isCallRunning ? (
                userVideoStream ? (
                    <>
                        <div className={'group relative h-full w-full'}>
                            <video
                                className={'h-full w-full rounded-xl object-contain'}
                                playsInline
                                ref={userVideo}
                                autoPlay
                            />
                            <div className={'absolute right-0 top-0 w-1/4 '}>
                                <video
                                    className={'rounded-xl'}
                                    playsInline
                                    muted
                                    ref={myVideo}
                                    autoPlay
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                )
            ) : (
                <div className={'mb-52 flex flex-col items-center'}>
                    <Unplug className={'h-28 w-28'} />
                    <video
                        playsInline
                        muted
                        ref={myVideo}
                        autoPlay
                        className={'absolute right-0 top-0 w-1/4'}
                    />
                </div>
            )}
            <div>
                <CallControllerControlls {...props} />
            </div>
        </div>
    )
}
