import { useAppDispatch, useAppSelector } from '@/base/appContext.tsx'
import { useCallback, useContext, useEffect, useRef } from 'react'
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
        console.log(message)
    })

    const handleConnectionClosedOrFailed = useCallback(() => {
        console.log('Handle connection failed')
        dispatch({ type: 'updateCallEndedRTCConn:', payload: true })
        dispatch({ type: 'updateCallAcceptedRTCConn', payload: false })
        dispatch({ type: 'updateCallControllerOpen', payload: false })
        rtcData.myStream?.getTracks().forEach((track) => track.stop())
        rtcData.oppositeStream.getTracks().forEach((track) => track.stop())
        dispatch({ type: 'updateMyStreamRTCConn', payload: undefined })
        dispatch({ type: 'updateOppositeStreamRTCConn', payload: new MediaStream() })
    }, [dispatch, rtcData.myStream, rtcData.oppositeStream])

    useEffect(() => {
        if (callControllerState.isAnswerCall) {
            dispatch({ type: 'updateIsAnswerCall', payload: false })
            answerCall(rtcData.oppositeId, handleConnectionClosedOrFailed)
        }
    }, [
        answerCall,
        callControllerState.isAnswerCall,
        dispatch,
        handleConnectionClosedOrFailed,
        rtcData.oppositeId,
    ])

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
        callClient(
            id,
            () => dispatch({ type: 'updateCallAcceptedRTCConn', payload: true }),
            handleConnectionClosedOrFailed
        )
    }

    const leaveCall = () => {
        connectionRef.current && connectionRef.current?.close()
        handleConnectionClosedOrFailed()
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
                id={userId}
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
