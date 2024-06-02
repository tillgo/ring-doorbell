import asyncio
import json
from threading import Thread

import psutil
from aiortc import RTCPeerConnection, RTCConfiguration, RTCIceServer, RTCSessionDescription
from aiortc.contrib.media import MediaPlayer
from aiortc.sdp import candidate_from_sdp

from utils.AudioPlayer import AudioPlayer
from utils.VideoPlayer import VideoStreamDisplay
from connectionClients.socket_client import SocketClient
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
        self.videoDisplay = None

    def handleTrack(self, track):
        print("received track")
        print(track)
        print(track.kind)
        if track.kind == 'video':
            print("Video track")
            self.videoDisplay = VideoStreamDisplay(self.ui.video_label, track)
            asyncio.get_running_loop().create_task(self.videoDisplay.show_video())
        elif track.kind == 'audio':
            print("Audio track")
            audioPlayer = AudioPlayer(track)
            audio_thread = Thread(target=asyncio.run, args=(audioPlayer.play(),))
            audio_thread.start()

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
        self.peer.on('track', lambda event: self.handleTrack(event))

        # add video
        camTrack = PiCameraTrack()
        self.peer.addTrack(camTrack)

        # add audio
        audioTrack = MediaPlayer("hw:2,0", format="alsa", options={'channels': '2',
                                                                   'sample_fmt': 's16'})
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
