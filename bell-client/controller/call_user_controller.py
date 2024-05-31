import asyncio
import json
import uuid

from aiortc import RTCPeerConnection, MediaStreamTrack, RTCConfiguration, RTCIceServer, RTCSessionDescription, \
    RTCIceCandidate
from aiortc.sdp import candidate_from_sdp

from connectionClients.socket_client import SocketClient
from picam_controller import PiCameraTrack


def getHandleRemoteIceCandidate(peer: RTCPeerConnection):
    def handleRemoteCandidate(data):
        candidateData = data['candidate']
        candidate = candidateData['candidate']
        # if empty candidate return
        if candidate == '':
            return
        sdpMLineIndex = candidateData['sdpMLineIndex']
        sdpMid = candidateData['sdpMid']
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
        await peer.setRemoteDescription(sessionDescription=RTCSessionDescription(sdp=remote_offer['sdp'],
                                                                                 type=remote_offer['type']))

        peer.on('track', lambda event: print("Track received"))
        self.socket_client.sio.on('iceCandidate',
                                  getHandleRemoteIceCandidate(peer))
        camTrack = PiCameraTrack()
        peer.addTrack(camTrack)
        print(peer.connectionState)
        answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        # has to use localdescription, as here the ice candidates are set
        self.socket_client.sendRTCAnswer(self.userId, peer.localDescription)

        peer.on('connectionstatechange', lambda : print(peer.connectionState))
