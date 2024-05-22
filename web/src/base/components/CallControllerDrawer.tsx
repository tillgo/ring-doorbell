import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
} from '@/lib/components/ui/drawer.tsx'
import { Button } from '@/lib/components/ui/button.tsx'
import { useAppDispatch, useAppSelector } from '@/base/appContext.tsx'
import { useEffect, useRef } from 'react'
import Peer, { MediaConnection } from 'peerjs'
import { CallControllerControlls } from '@/base/components/CallControllerControlls.tsx'
import { VideoComponent } from '@/base/components/VideoComponent.tsx'
import { X } from 'lucide-react'
import { useSocket } from '@/common/hooks/useSocket.ts'

export const CallControllerDrawer = (props: { userId: string }) => {
    // ToDo socket connects itself two times. What is the problem? (Maybe component gets completly rerendered)
    const socket = useSocket()

    const { userId } = props
    const dispatch = useAppDispatch()
    const open = useAppSelector((s) => s.callController.open)
    const rtcData = useAppSelector((s) => s.rtcConnection)

    const myVideo = useRef<HTMLVideoElement>(null)
    const userVideo = useRef<HTMLVideoElement>(null)
    const connectionRef = useRef<Peer>()
    const callRef = useRef<MediaConnection>()

    useEffect(() => {
        // Only connect, if socket not already connected
        if (!socket?.connected) {
            socket?.connect()
        }
    }, [socket])

    useEffect(() => {
        socket?.on('callClient', (data) => {
            dispatch({ type: 'updateReceivingCallRTCConn', payload: true })
            dispatch({ type: 'updateCallerRTCConn', payload: data.from })
            dispatch({ type: 'updateNameRTCConn', payload: data.name })
            dispatch({ type: 'updateCallerSignalRTCConn', payload: data.signal })
        })

        socket?.on('callFailed', (message) => {
            //ToDo handle failed call
            console.log(message)
        })
    }, [dispatch, socket])

    const callUser = (id: string) => {
        const peer = new Peer()

        peer.on('open', (rtcId) => {
            socket?.emit('callClient', {
                clientToCall: id,
                signalData: rtcId,
                from: userId,
                name: rtcData.name,
            })
        })

        socket?.on('callAccepted', (signal) => {
            dispatch({ type: 'updateCallAcceptedRTCConn', payload: true })

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                dispatch({ type: 'updateStreamRTCConn', payload: stream })
                callRef.current = peer.call(signal, stream)
            })

            callRef.current?.on('stream', (remoteStream) => {
                userVideo.current!.srcObject = remoteStream
            })
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        dispatch({ type: 'updateCallAcceptedRTCConn', payload: true })
        const peer = new Peer()

        peer.on('open', (id) => {
            socket?.emit('answerCall', {
                signal: id,
                to: rtcData.caller,
            })
        })

        peer.on('call', (call) => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                dispatch({ type: 'updateStreamRTCConn', payload: stream })
                call.answer(stream)
            })

            call.on('stream', (remoteStream) => {
                userVideo.current!.srcObject = remoteStream
            })
            callRef.current = call
        })

        connectionRef.current = peer
    }

    const leaveCall = () => {
        dispatch({ type: 'updateCallEndedRTCConn:', payload: true })
        connectionRef.current && connectionRef.current.destroy()
    }

    const enableVideo = () => {
        if (myVideo.current !== null) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                console.log('Test')
                dispatch({ type: 'updateStreamRTCConn', payload: stream })
                myVideo.current!.srcObject = stream
            })
        }
    }

    //ToDo Bei disable auch keinen Stream mehr an den anderen User schicken
    const disableVideo = () => {
        if (myVideo.current) {
            dispatch({ type: 'updateStreamRTCConn', payload: undefined })
            myVideo.current.srcObject = null
        }
    }

    const onDrawerClose = () => {
        dispatch({ type: 'updateCallControllerOpen', payload: false })
    }

    return (
        <Drawer onClose={onDrawerClose} open={open}>
            <DrawerContent className={'h-full'}>
                <DrawerHeader></DrawerHeader>
                <div className={'flex justify-center'}>
                    <VideoComponent
                        isCallRunning={rtcData.callAccepted && !rtcData.callEnded}
                        myVideo={myVideo}
                        userVideo={userVideo}
                    />
                </div>
                {rtcData.receivingCall && !rtcData.callAccepted ? (
                    <Button className={'mb-2'} onClick={answerCall}>
                        Accept Call
                    </Button>
                ) : null}
                <CallControllerControlls
                    isVideoOn={!!rtcData.stream}
                    isCallRunning={rtcData.receivingCall && !rtcData.callAccepted}
                    id={userId}
                    onEnableVideo={enableVideo}
                    onDisableVideo={disableVideo}
                    onStartCall={() => callUser(rtcData.idToCall)}
                    onEndCall={leaveCall}
                    onIdInputChange={(event) =>
                        dispatch({
                            type: 'updateIdToCallRTCConn',
                            payload: event.target.value,
                        })
                    }
                ></CallControllerControlls>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button size={'icon'} variant="outline" onClick={onDrawerClose}>
                            <X className={'h-32 w-32'} />
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
