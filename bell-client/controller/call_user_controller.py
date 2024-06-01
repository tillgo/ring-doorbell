import asyncio
import json

import psutil
from aiortc import RTCPeerConnection, RTCConfiguration, RTCIceServer, RTCSessionDescription
from aiortc.contrib.media import MediaPlayer
from aiortc.sdp import candidate_from_sdp

from connectionClients.socket_client import SocketClient
from utils.piaudiotrack import PiAudioTrack
from utils.picameratrack import PiCameraTrack


def getHandleRemoteIceCandidate(peer: RTCPeerConnection):
    async def handleRemoteCandidate(data):
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
        print("adding peer")
        await peer.addIceCandidate(ice_candidate)

    return handleRemoteCandidate


class CallUserController:

    def __init__(self, ui):
        self.ui = ui
        self.socket_client = SocketClient()
        self.userId = ''
        self.peer = None

    def call_user(self, user_id: str):
        self.userId = user_id
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.call_page)
        self.socket_client.connect()

        self.socket_client.callUser(self.userId, "", self.handle_call_accepted)

    def handle_call_accepted(self, data):
        print("Call was accepted yayyyyy")
        asyncio.run(self.create_WebRTC_Connection(data))

    async def create_WebRTC_Connection(self, data):
        self.peer = RTCPeerConnection(RTCConfiguration(iceServers=[RTCIceServer(urls="stun:stun1.l.google.com:19302"),
                                                                   RTCIceServer(urls="stun:stun2.l.google.com:19302")]))

        self.socket_client.sio.on('iceCandidate',
                                  lambda event: asyncio.run(getHandleRemoteIceCandidate(self.peer)(event)))
        self.peer.on('track', lambda event: print("Track received "))

        # add video
        camTrack = PiCameraTrack()
        self.peer.addTrack(camTrack)

        # add audio
        audioTrack = MediaPlayer("hw:2,0")
        self.peer.addTrack(audioTrack.audio)

        self.peer.on('connectionstatechange', lambda: print("State: " + self.peer.connectionState))

        remote_offer = json.loads(data)
        await self.peer.setRemoteDescription(sessionDescription=RTCSessionDescription(sdp=remote_offer['sdp'],
                                                                                      type=remote_offer['type']))

        answer = await self.peer.createAnswer()
        await self.peer.setLocalDescription(answer)
        # has to use localdescription, as here the ice candidates are set
        self.socket_client.sendRTCAnswer(self.userId, self.peer.localDescription)

        while True:
            await asyncio.sleep(3)
            print("State: " + self.peer.connectionState)
            print("CPU %" + str(psutil.cpu_percent()))
            print("MEMORY" + str(psutil.virtual_memory().percent) + "%")
            if (self.peer.connectionState == "failed" or self.peer.connectionState == "disconnected"
                    or self.peer.connectionState == "closed"):
                print("Exiting now")
                break
