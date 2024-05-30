import { Drawer, DrawerClose, DrawerContent, DrawerFooter } from '@/lib/components/ui/drawer.tsx'
import { Button } from '@/lib/components/ui/button.tsx'
import { useAppDispatch, useAppSelector } from '@/base/appContext.tsx'
import { useContext, useEffect, useRef } from 'react'
import Peer, { MediaConnection } from 'peerjs'
import { VideoComponent } from '@/base/components/VideoComponent.tsx'
import { X } from 'lucide-react'
import { SocketContext } from '@/common/provider/SocketProvider.tsx'

export const CallControllerDrawer = (props: { userId: string }) => {
    // ToDo socket connects itself two times. What is the problem? (Maybe component gets completly rerendered)
    const socket = useContext(SocketContext)
    const { userId } = props
    const dispatch = useAppDispatch()
    const callControllerState = useAppSelector((s) => s.callController)
    const rtcData = useAppSelector((s) => s.rtcConnection)

    const connectionRef = useRef<Peer>()
    const callRef = useRef<MediaConnection>()

    useEffect(() => {
        if (callControllerState.isAnswerCall) {
            dispatch({ type: 'updateIsAnswerCall', payload: false })
            const peer = new Peer()

            peer.on('open', (id) => {
                socket?.emit('answerCall', {
                    signal: id,
                    to: rtcData.oppositeId,
                })
            })

            peer.on('call', (call) => {
                console.log('Got a Peerjs call')
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                    dispatch({ type: 'updateMyStreamRTCConn', payload: stream })
                    call.answer(stream)
                })

                call.on('stream', (remoteStream) => {
                    dispatch({ type: 'updateOppositeStreamRTCConn', payload: remoteStream })
                })
                callRef.current = call
            })

            connectionRef.current = peer
        }
    }, [callControllerState.isAnswerCall, dispatch, rtcData.oppositeId, socket])

    useEffect(() => {
        socket?.on('callFailed', (message) => {
            //ToDo handle failed call
            console.log(message)
        })

        socket?.on('callOver', () => {
            dispatch({ type: 'updateCallEndedRTCConn:', payload: true })
            dispatch({ type: 'updateCallAcceptedRTCConn', payload: false })
            connectionRef.current && connectionRef.current.destroy()
        })
    }, [dispatch, socket])

    const callUser = (id: string) => {
        const peer = new Peer()
        dispatch({ type: 'updateOppositeIdRTCConn', payload: id })
        peer.on('open', (rtcId) => {
            socket?.emit('callClient', {
                to: id,
                signalData: rtcId,
            })
        })

        socket?.on('callAccepted', (signal) => {
            dispatch({ type: 'updateCallAcceptedRTCConn', payload: true })

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                dispatch({ type: 'updateMyStreamRTCConn', payload: stream })
                callRef.current = peer.call(signal, stream)
            })

            callRef.current?.on('stream', (remoteStream) => {
                dispatch({ type: 'updateOppositeStreamRTCConn', payload: remoteStream })
            })
        })

        socket?.on('callDenied', () => {
            //ToDo just for testing purposes, in reality the webclient doesnt make calls, so cant get denied
            console.log('Call Denied')
            connectionRef.current && connectionRef.current.destroy()
        })

        connectionRef.current = peer
    }

    const leaveCall = () => {
        dispatch({ type: 'updateCallEndedRTCConn:', payload: true })
        dispatch({ type: 'updateCallAcceptedRTCConn', payload: false })
        socket?.emit('leaveCall', { to: rtcData.oppositeId })
        connectionRef.current && connectionRef.current.destroy()
    }

    const enableVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            dispatch({ type: 'updateMyStreamRTCConn', payload: stream })
        })
    }

    //ToDo Bei disable auch keinen Stream mehr an den anderen User schicken
    const disableVideo = () => {
        dispatch({ type: 'updateMyStreamRTCConn', payload: undefined })
    }

    const onDrawerClose = () => {
        dispatch({ type: 'updateCallControllerOpen', payload: false })
    }

    return (
        <Drawer onClose={onDrawerClose} open={callControllerState.open}>
            <DrawerContent className={'h-full'}>
                <div className={'mt-2 flex h-full items-center justify-center'}>
                    <VideoComponent
                        isCallRunning={rtcData.callAccepted && !rtcData.callEnded}
                        myVideoStream={rtcData.myStream}
                        userVideoStream={rtcData.oppositeStream}
                        isVideoOn={!!rtcData.myStream}
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
                    />
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button size={'icon'} variant="outline" onClick={onDrawerClose}>
                            <X />
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
