import asyncio
import json
from threading import Thread

import psutil
from aiortc import RTCPeerConnection, RTCConfiguration, RTCIceServer, RTCSessionDescription
from aiortc.contrib.media import MediaPlayer, MediaRecorder
from aiortc.sdp import candidate_from_sdp

from controller.after_call_controller import AfterCallController
from utils.AudioPlayer import AudioPlayer
from utils.VideoPlayer import VideoStreamDisplay
from connectionClients.socket_client import SocketClient
from utils.picameratrack import PiCameraTrack


def getHandleRemoteIceCandidate(peer: RTCPeerConnection):
    async def handleRemoteCandidate(data):
        candidateData = data['candidate']
        candidate = candidateData['candidate']
        print("getting Ice candidate")
        # if empty candidate return
        if candidate == '':
            print("empty candidate " + candidate)
            return
        sdpMLineIndex = candidateData['sdpMLineIndex']
        sdpMid = candidateData['sdpMid']
        ice_candidate = candidate_from_sdp(candidate)
        ice_candidate.sdpMLineIndex = sdpMLineIndex
        ice_candidate.sdpMid = sdpMid
        await peer.addIceCandidate(ice_candidate)

    return handleRemoteCandidate


class CallUserController:

    def __init__(self, ui, main_controller):
        self.ui = ui
        self.main_controller = main_controller
        self.socket_client = SocketClient()
        self.userId = ''
        self.peer: RTCPeerConnection | None = None
        self.video_track: PiCameraTrack | None = None
        self.audio_track: MediaPlayer | None = None
        self.videoDisplay = None
        self.audioPlayer: AudioPlayer | None = None

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
            self.audioPlayer = audioPlayer
            audio_thread = Thread(target=asyncio.run, args=(audioPlayer.play(),))
            audio_thread.start()

    def call_user(self, user_id: str):
        self.userId = user_id
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.call_page)
        self.ui.video_label.setText("Calling...")
        self.socket_client.connect()

        self.peer = RTCPeerConnection(RTCConfiguration(iceServers=[RTCIceServer(urls="stun:stun1.l.google.com:19302"),
                                                           RTCIceServer(urls="stun:stun2.l.google.com:19302")]))
        self.socket_client.sio.on('iceCandidate',
                                  lambda data: asyncio.run(getHandleRemoteIceCandidate(self.peer)(data)))
        self.socket_client.sio.on('callOver', lambda: self.handleCallEnd("ended"))
        self.socket_client.sio.on('callDenied', lambda: self.handleCallEnd("denied"))
        self.socket_client.sio.on('callFailed', lambda data: self.handleCallEnd("failed"))

        self.socket_client.callUser(self.userId, self.handle_call_accepted)

    def handleCallEnd(self, end_type: str):
        if self.peer:
            self.peer.close()
            self.peer = None

        if self.video_track:
            self.video_track.stop_cam()
            self.video_track = None

        if self.audio_track:
            self.audio_track.audio.stop()
            self.audio_track = None

        if self.audioPlayer:
            self.audioPlayer.stop()
            self.audioPlayer = None
        # Open After Call Page
        AfterCallController(end_type, self.ui, self.main_controller)

    def handle_call_accepted(self, data):
        print("Call was accepted yayyyyy")
        asyncio.run(self.create_WebRTC_Connection(data))

    async def create_WebRTC_Connection(self, data_offer):

        self.peer.on('track', lambda event: self.handleTrack(event))

        # add video
        self.video_track = PiCameraTrack()
        self.peer.addTrack(self.video_track)

        # add audio
        self.audio_track = MediaPlayer("hw:2,0", format="alsa", options={'channels': '1', 'sample_rate': '100',
                                                                   'sample_fmt': 's16'})
        self.peer.addTrack(self.audio_track.audio)

        self.peer.on('connectionstatechange', lambda: print("State: " + self.peer.connectionState))
        self.peer.on('iceconnectionstatechange', lambda: print("ICE State: " + self.peer.iceConnectionState))

        remote_offer = json.loads(data_offer)
        await self.peer.setRemoteDescription(sessionDescription=RTCSessionDescription(sdp=remote_offer['sdp'],
                                                                                      type=remote_offer['type']))

        answer = await self.peer.createAnswer()
        await self.peer.setLocalDescription(answer)
        # has to use localdescription, as here the ice candidates are set
        self.socket_client.sendRTCAnswer(self.userId, self.peer.localDescription)

        while True:
            await asyncio.sleep(3)
            print("CPU %" + str(psutil.cpu_percent()))
            print("MEMORY" + str(psutil.virtual_memory().percent) + "%")
            if (
                    self.peer is None or self.peer.connectionState == "failed" or self.peer.connectionState == "disconnected"
                    or self.peer.connectionState == "closed"):
                print("Exiting now")
                break
