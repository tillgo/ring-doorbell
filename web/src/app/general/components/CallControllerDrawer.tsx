import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useAppDispatch, useAppSelector } from '@/base/appContext.tsx'
import { useEffect, useRef } from 'react'
import { socket } from '@/common/socketio/socket.ts'
import SimplePeer from 'simple-peer'
import { Input } from '@/components/ui/input.tsx'

export const CallControllerDrawer = () => {
    const dispatch = useAppDispatch()
    const open = useAppSelector((s) => s.callController.open)
    const rtcData = useAppSelector((s) => s.rtcConnection)

    const myVideo = useRef<HTMLVideoElement>(null)
    const userVideo = useRef<HTMLVideoElement>(null)
    const connectionRef = useRef<SimplePeer.Instance>()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            dispatch({ type: 'updateRTCConnStream', payload: stream })
            myVideo.current!.srcObject = stream
        })

        socket.on('me', (id) => {
            dispatch({ type: 'updateMeRTCConn', payload: id })
        })

        socket.on('callUser', (data) => {
            dispatch({ type: 'updateReceivingCallRTCConn', payload: true })
            dispatch({ type: 'updateCallerRTCConn', payload: data.from })
            dispatch({ type: 'updateNameRTCConn', payload: data.name })
            dispatch({ type: 'updateCallerSignalRTCConn', payload: data.signal })
        })
    }, [])

    const callUser = (id: string) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: rtcData.stream,
        })

        peer.on('signal', (data) => {
            socket.emit('callUser', {
                userToCall: id,
                signalData: data,
                from: rtcData.me,
                name: rtcData.name,
            })
        })

        peer.on('stream', (stream) => {
            userVideo.current!.srcObject = stream
        })

        socket.on('callAccepted', (signal) => {
            dispatch({ type: 'updateCallAcceptedRTCConn', payload: true })
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        dispatch({ type: 'updateCallAcceptedRTCConn', payload: true })
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream: rtcData.stream,
        })

        peer.on('signal', (data) => {
            socket.emit('answerCall', {
                signal: data,
                to: rtcData.caller,
            })
        })

        peer.on('stream', (stream) => {
            userVideo.current!.srcObject = stream
        })

        rtcData.callerSignal && peer.signal(rtcData.callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        dispatch({ type: 'updateCallEndedRTCConn:', payload: true })
        connectionRef.current && connectionRef.current.destroy()
    }

    const onDrawerClose = () => {
        dispatch({ type: 'updateCallControllerOpen', payload: false })
    }

    return (
        <Drawer onClose={onDrawerClose} open={open}>
            <DrawerContent className={'h-full'}>
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                {rtcData.stream && (
                    <video playsInline muted ref={myVideo} autoPlay className={'w-40'} />
                )}
                {rtcData.callAccepted && !rtcData.callEnded && (
                    <video playsInline ref={userVideo} autoPlay className={'mb-2 w-40'} />
                )}
                <div className={'mb-2'}>{rtcData.me}</div>
                <Input
                    id={'id-field'}
                    onChange={(event) => {
                        dispatch({ type: 'updateIdToCallRTCConn', payload: event.target.value })
                    }}
                />
                {rtcData.callAccepted && !rtcData.callEnded ? (
                    <Button className={'mb-2 accent-red-600'} onClick={leaveCall}>
                        End Call
                    </Button>
                ) : (
                    <Button
                        className={'mb-2 accent-green-600'}
                        onClick={() => callUser(rtcData.idToCall)}
                    >
                        Call
                    </Button>
                )}

                {rtcData.receivingCall && !rtcData.callAccepted ? (
                    <Button className={'mb-2'} onClick={answerCall}>
                        Accept Call
                    </Button>
                ) : null}

                <DrawerFooter>
                    <DrawerClose onClick={onDrawerClose}>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
