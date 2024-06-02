import { useAppDispatch, useAppSelector } from '@/base/appContext.tsx'
import { useContext, useEffect, useRef } from 'react'
import { VideoComponent } from '@/base/components/VideoComponent.tsx'
import { SocketContext } from '@/common/provider/SocketProvider.tsx'
import { useCallClient } from '@/common/hooks/useCallClient.ts'
import { cn } from '@/lib/utils.ts'

export const VideoCallPage = ({ userId }: { userId: string }) => {
    const socket = useContext(SocketContext)
    const dispatch = useAppDispatch()
    const callControllerState = useAppSelector((s) => s.callController)
    const rtcData = useAppSelector((s) => s.rtcConnection)

    const { answerCall, answerConnectionInfo, callClient, callConnectionInfo } = useCallClient()

    const connectionRef = useRef<RTCPeerConnection>()

    socket?.on('callFailed', (message) => {
        //ToDo handle failed call
        console.log(message)
    })

    socket?.on('callOver', () => {
        dispatch({ type: 'updateCallEndedRTCConn:', payload: true })
        dispatch({ type: 'updateCallAcceptedRTCConn', payload: false })
        connectionRef.current && connectionRef.current?.close()
    })

    useEffect(() => {
        if (callControllerState.isAnswerCall) {
            dispatch({ type: 'updateIsAnswerCall', payload: false })
            answerCall(rtcData.oppositeId)
        }
    }, [answerCall, callControllerState.isAnswerCall, dispatch, rtcData.oppositeId])

    // ToDo kein useEffect nehmen
    useEffect(() => {
        connectionRef.current = answerConnectionInfo.rtcPeer
        dispatch({ type: 'updateMyStreamRTCConn', payload: answerConnectionInfo.ownStream })
        dispatch({
            type: 'updateOppositeStreamRTCConn',
            payload: answerConnectionInfo.oppositeStream,
        })
    }, [
        answerConnectionInfo.oppositeStream,
        answerConnectionInfo.ownStream,
        answerConnectionInfo.rtcPeer,
        dispatch,
    ])

    // ToDo kein useEffect nehmen
    useEffect(() => {
        connectionRef.current = callConnectionInfo.rtcPeer
        dispatch({ type: 'updateMyStreamRTCConn', payload: callConnectionInfo.ownStream })
        dispatch({
            type: 'updateOppositeStreamRTCConn',
            payload: callConnectionInfo.oppositeStream,
        })
    }, [
        callConnectionInfo.oppositeStream,
        callConnectionInfo.ownStream,
        callConnectionInfo.rtcPeer,
        dispatch,
    ])

    const callUser = (id: string) => {
        dispatch({ type: 'updateOppositeIdRTCConn', payload: id })
        callClient(id, () => dispatch({ type: 'updateCallAcceptedRTCConn', payload: true }))
    }

    const leaveCall = () => {
        dispatch({ type: 'updateCallEndedRTCConn:', payload: true })
        dispatch({ type: 'updateCallAcceptedRTCConn', payload: false })
        dispatch({ type: 'updateCallControllerOpen', payload: false })
        socket?.emit('leaveCall', { to: rtcData.oppositeId })
        connectionRef.current && connectionRef.current?.close()
    }

    const enableVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(async (stream) => {
            const videoSettings = stream.getVideoTracks()[0].getSettings()
            await stream.getVideoTracks()[0].applyConstraints({
                width: { ideal: videoSettings.width! / 2 },
                height: { ideal: videoSettings.height! / 2 },
            })
            dispatch({ type: 'updateMyStreamRTCConn', payload: stream })
        })
    }

    //ToDo Bei disable auch keinen Stream mehr an den anderen User schicken
    const disableVideo = () => {
        dispatch({ type: 'updateMyStreamRTCConn', payload: undefined })
    }

    return (
        <div
            className={cn('fixed left-0 top-0 z-20 h-dvh w-dvw bg-background', {
                hidden: !callControllerState.open,
            })}
        >
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
    )
}