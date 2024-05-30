import { Drawer, DrawerClose, DrawerContent, DrawerFooter } from '@/lib/components/ui/drawer.tsx'
import { Button } from '@/lib/components/ui/button.tsx'
import { useAppDispatch, useAppSelector } from '@/base/appContext.tsx'
import { useContext, useEffect, useRef } from 'react'
import { VideoComponent } from '@/base/components/VideoComponent.tsx'
import { X } from 'lucide-react'
import { SocketContext } from '@/common/provider/SocketProvider.tsx'

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
}

export const CallControllerDrawer = (props: { userId: string }) => {
    const { userId } = props

    const socket = useContext(SocketContext)
    const dispatch = useAppDispatch()
    const callControllerState = useAppSelector((s) => s.callController)
    const rtcData = useAppSelector((s) => s.rtcConnection)

    const connectionRef = useRef<RTCPeerConnection>()

    useEffect(() => {
        if (callControllerState.isAnswerCall) {
            dispatch({ type: 'updateIsAnswerCall', payload: false })

            const peer = new RTCPeerConnection(servers)
            socket?.on('iceCandidate', async (data) => {
                await peer.addIceCandidate(new RTCIceCandidate(data.candidate))
            })

            peer.onicecandidate = (event) => {
                if (event.candidate) {
                    socket?.emit('iceCandidate', {
                        candidate: event.candidate,
                        to: rtcData.oppositeId,
                    })
                }
            }

            peer.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    rtcData.oppositeStream.addTrack(track)
                })
            }

            socket?.on('answerSignal', async (signal) => {
                await peer.setRemoteDescription(JSON.parse(signal))
            })

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                dispatch({ type: 'updateMyStreamRTCConn', payload: stream })
                console.log(stream)

                //Set stream before creatig offer
                stream.getTracks().forEach((track) => {
                    peer.addTrack(track, stream)
                })

                peer.createOffer().then(async (offer) => {
                    await peer.setLocalDescription(offer)
                    socket?.emit('answerCall', {
                        signal: JSON.stringify(offer),
                        to: rtcData.oppositeId,
                    })
                })
            })

            connectionRef.current = peer
        }
    }, [
        callControllerState.isAnswerCall,
        dispatch,
        rtcData.oppositeId,
        rtcData.oppositeStream,
        socket,
    ])

    useEffect(() => {
        socket?.on('callFailed', (message) => {
            //ToDo handle failed call
            console.log(message)
        })

        socket?.on('callOver', () => {
            dispatch({ type: 'updateCallEndedRTCConn:', payload: true })
            dispatch({ type: 'updateCallAcceptedRTCConn', payload: false })
            connectionRef.current && connectionRef.current?.close()
        })
    }, [dispatch, socket])

    const callUser = (id: string) => {
        const peer = new RTCPeerConnection(servers)
        dispatch({ type: 'updateOppositeIdRTCConn', payload: id })

        socket?.emit('callClient', {
            to: id,
        })

        socket?.on('callAccepted', (signal) => {
            dispatch({ type: 'updateCallAcceptedRTCConn', payload: true })

            peer.onicecandidate = (event) => {
                if (event.candidate) {
                    socket?.emit('iceCandidate', {
                        candidate: event.candidate,
                        to: id,
                    })
                }
            }

            peer.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    rtcData.oppositeStream.addTrack(track)
                })
            }

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                dispatch({ type: 'updateMyStreamRTCConn', payload: stream })

                //Set stream before creating offer
                stream.getTracks().forEach((track) => {
                    peer.addTrack(track, stream)
                })

                peer.setRemoteDescription(JSON.parse(signal)).then(() => {
                    peer.createAnswer().then(async (answer) => {
                        await peer.setLocalDescription(answer)
                        socket?.emit('answerSignal', {
                            signal: JSON.stringify(answer),
                            to: id,
                        })
                    })
                })
            })
        })

        socket?.on('callDenied', () => {
            //ToDo just for testing purposes, in reality the webclient doesnt make calls, so cant get denied
            console.log('Call Denied')
            connectionRef.current && connectionRef.current?.close()
        })

        connectionRef.current = peer
    }

    const leaveCall = () => {
        dispatch({ type: 'updateCallEndedRTCConn:', payload: true })
        dispatch({ type: 'updateCallAcceptedRTCConn', payload: false })
        socket?.emit('leaveCall', { to: rtcData.oppositeId })
        connectionRef.current && connectionRef.current?.close()
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
