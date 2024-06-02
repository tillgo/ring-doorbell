import { useContext, useState } from 'react'
import { SocketContext } from '@/common/provider/SocketProvider.tsx'

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
}

type RTCConnectionInfo = {
    ownStream: MediaStream | undefined
    oppositeStream: MediaStream
    rtcPeer: RTCPeerConnection | undefined
}

const initialRTConnectionInfo: RTCConnectionInfo = {
    ownStream: undefined,
    oppositeStream: new MediaStream(),
    rtcPeer: undefined,
}
export function useCallClient() {
    const socket = useContext(SocketContext)
    const [answerConnectionInfo, setAnswerConnectionInfo] =
        useState<RTCConnectionInfo>(initialRTConnectionInfo)
    const [callConnectionInfo, setCallConnectionInfo] =
        useState<RTCConnectionInfo>(initialRTConnectionInfo)

    const handleNewIceCandidate = (userId: string) => (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
            console.log('Sending candidate')
            socket?.emit('iceCandidate', {
                candidate: event.candidate,
                to: userId,
            })
        }
    }

    const handleNewTrack = (clientStream: MediaStream) => (event: RTCTrackEvent) => {
        console.log(event)
        event.streams[0].getTracks().forEach((track) => {
            clientStream.addTrack(track)
        })
    }

    const answerCall = (clientId: string) => {
        const peer = new RTCPeerConnection(servers)
        socket?.on('iceCandidate', async (data) => {
            await peer.addIceCandidate(new RTCIceCandidate(data.candidate))
        })

        peer.onicecandidate = handleNewIceCandidate(clientId)

        const clientStream = new MediaStream()
        peer.ontrack = handleNewTrack(clientStream)

        socket?.on('answerSignal', async (signal) => {
            console.log('set answerSignal')
            await peer.setRemoteDescription(signal)
        })

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            //Set stream before creating offer
            stream.getTracks().forEach((track) => {
                peer.addTrack(track, stream)
            })

            peer.createOffer().then(async (offer) => {
                await peer.setLocalDescription(offer)
                socket?.emit('answerCall', {
                    signal: JSON.stringify(offer),
                    to: clientId,
                })
            })

            // Making info accessible to users of hook
            setAnswerConnectionInfo({
                ownStream: stream,
                oppositeStream: clientStream,
                rtcPeer: peer,
            })
        })
    }

    const callClient = (clientId: string, onCallAccepted: () => void) => {
        const peer = new RTCPeerConnection(servers)

        socket?.emit('callClient', {
            to: clientId,
        })

        socket?.on('callAccepted', (signal) => {
            onCallAccepted()

            peer.onicecandidate = (event) => {
                if (event.candidate) {
                    socket?.emit('iceCandidate', {
                        candidate: event.candidate,
                        to: clientId,
                    })
                }
            }

            const clientStream = new MediaStream()
            peer.ontrack = handleNewTrack(clientStream)

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                //Set stream before creating offer
                stream.getTracks().forEach((track) => {
                    peer.addTrack(track, stream)
                })

                peer.setRemoteDescription(JSON.parse(signal)).then(() => {
                    peer.createAnswer().then(async (answer) => {
                        await peer.setLocalDescription(answer)
                        socket?.emit('answerSignal', {
                            signal: JSON.stringify(answer),
                            to: clientId,
                        })
                    })
                })

                // Making info accessible to users of hook
                setCallConnectionInfo({
                    ownStream: stream,
                    oppositeStream: clientStream,
                    rtcPeer: peer,
                })
            })
        })
    }

    return { answerCall, answerConnectionInfo, callClient, callConnectionInfo }
}
