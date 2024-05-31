import asyncio
import json
import uuid

from aiortc import RTCPeerConnection, MediaStreamTrack, RTCConfiguration, RTCIceServer, RTCSessionDescription, \
    RTCIceCandidate
from aiortc.sdp import candidate_from_sdp

from connectionClients.socket_client import SocketClient
from picam_controller import PiCameraTrack


def getHandleIceCandidateEvent(socket, userId):
    def handleIceCandidateEvent(event):
        if event.candidate:
            print("Ice Candidate event")
            socket.sendIceCandidate(userId, event.candidate)

    return handleIceCandidateEvent

def getHandleRemoteIceCandidate(peer: RTCPeerConnection):
    def handleRemoteCandidate(data):
        print(data)
        candidate = data['candidate']
        sdpMLineIndex = data['sdpMLineIndex']
        sdpMid = data['sdpMid']
        ice_candidate = candidate_from_sdp(candidate)
        ice_candidate.sdpMLineIndex = sdpMLineIndex
        ice_candidate.sdpMid = sdpMid
        peer.addIceCandidate(ice_candidate)

    return handleRemoteCandidate

class CallUserController:

    def __init__(self, ui):
        self.ui = ui
        self.socket_client = SocketClient()
        self.userId = ''

    def call_user(self, user_id: str):
        self.userId = user_id
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.call_page)
        self.socket_client.connect()

        self.socket_client.callUser(self.userId, "", self.handle_call_accepted)

    def handle_call_accepted(self, data):
        print("Call was accepted yayyyyy")
        loop = asyncio.new_event_loop()
        loop.run_until_complete(self.create_WebRTC_Connection(data))

    async def create_WebRTC_Connection(self, data):
        peer = RTCPeerConnection(RTCConfiguration(iceServers=[RTCIceServer(urls="stun:stun1.l.google.com:19302"),
                                                              RTCIceServer(urls="stun:stun2.l.google.com:19302")]))

        remote_offer = json.loads(data)
        print(remote_offer)
        await peer.setRemoteDescription(sessionDescription=RTCSessionDescription(sdp=remote_offer['sdp'],
                                                                                 type=remote_offer['type']))

        peer.on('icecandidate', getHandleIceCandidateEvent(self.socket_client, self.userId))
        peer.on('track', lambda event: print(event))
        self.socket_client.sio.on('iceCandidate',
                                  lambda iceData: peer.addIceCandidate(RTCIceCandidate(iceData['candidate'])))
        camTrack = PiCameraTrack()
        peer.addTrack(camTrack)
        answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        self.socket_client.sendRTCAnswer(self.userId, answer)
