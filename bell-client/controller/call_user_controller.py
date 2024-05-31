import asyncio
import json

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

    def call_user(self, user_id: str):
        self.userId = user_id
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.call_page)
        self.socket_client.connect()

        self.socket_client.callUser(self.userId, "", self.handle_call_accepted)

    def handle_call_accepted(self, data):
        print("Call was accepted yayyyyy")
        loop = asyncio.new_event_loop()
        loop.create_task(self.create_WebRTC_Connection(data, loop))
        loop.run_forever()

    async def create_WebRTC_Connection(self, data, loop):
        peer = RTCPeerConnection(RTCConfiguration(iceServers=[RTCIceServer(urls="stun:stun1.l.google.com:19302"),
                                                              RTCIceServer(urls="stun:stun2.l.google.com:19302")]))

        peer.on('track', lambda event: print("Track received"))

        # add video
        camTrack = PiCameraTrack()
        peer.addTrack(camTrack)

        # add audio
        audioTrack = MediaPlayer("default", format="pulse")
        peer.addTrack(audioTrack.audio)

        peer.on('connectionstatechange', lambda: print("State: " + peer.connectionState))

        remote_offer = json.loads(data)
        await peer.setRemoteDescription(sessionDescription=RTCSessionDescription(sdp=remote_offer['sdp'],
                                                                                 type=remote_offer['type']))

        answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        # has to use localdescription, as here the ice candidates are set
        self.socket_client.sendRTCAnswer(self.userId, peer.localDescription)
