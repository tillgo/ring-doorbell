from aiortc import RTCPeerConnection, MediaStreamTrack

from connectionClients.socket_client import SocketClient


class CallUserController:

    def __init__(self, ui):
        self.ui = ui
        self.socket_client = SocketClient()

    def call_user(self, user_id: str):
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.call_page)
        self.socket_client.connect()
        self.socket_client.callUser(user_id, "no valid signal", self.handle_call_accepted)

    def handle_call_accepted(self, data):
        print("Call was accepted yayyyyy")
        print(data)
        pc = RTCPeerConnection()
        video_track = MediaStreamTrack()
        pc.addTrack(video_track)


