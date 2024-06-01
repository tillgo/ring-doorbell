import asyncio
import json
from multiprocessing import Process

from aiortc import RTCPeerConnection, RTCConfiguration, RTCIceServer, RTCSessionDescription
from aiortc.contrib.media import MediaPlayer

from connectionClients.socket_client import SocketClient
from utils.piaudiotrack import PiAudioTrack
from utils.picameratrack import PiCameraTrack


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
        process = Process(target=self.create_WebRTC_Connection, args=(data,))
        process.start()

    async def create_WebRTC_Connection(self, data):
        self.peer = RTCPeerConnection(RTCConfiguration(iceServers=[RTCIceServer(urls="stun:stun1.l.google.com:19302"),
                                                              RTCIceServer(urls="stun:stun2.l.google.com:19302")]))

        self.peer.on('track', lambda event: print("Track received "))

        # add video
        camTrack = PiCameraTrack()
        self.peer.addTrack(camTrack)

        # add audio
        audioTrack = PiAudioTrack()
        self.peer.addTrack(audioTrack)

        self.peer.on('connectionstatechange', lambda: print("State: " + self.peer.connectionState))

        remote_offer = json.loads(data)
        await self.peer.setRemoteDescription(sessionDescription=RTCSessionDescription(sdp=remote_offer['sdp'],
                                                                                 type=remote_offer['type']))

        answer = await self.peer.createAnswer()
        await self.peer.setLocalDescription(answer)
        # has to use localdescription, as here the ice candidates are set
        self.socket_client.sendRTCAnswer(self.userId, self.peer.localDescription)

        while True:
            await asyncio.sleep(10)
            print("State: " + self.peer.connectionState)
            if (self.peer.connectionState == "failed" or self.peer.connectionState == "disconnected"
                    or self.peer.connectionState == "closed"):
                print("ending")
                break
