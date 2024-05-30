from aiortc import RTCPeerConnection, MediaStreamTrack, RTCConfiguration, RTCIceServer
from peerjs.peer import Peer, PeerOptions

from connectionClients.socket_client import SocketClient


class CallUserController:

    def __init__(self, ui):
        self.ui = ui
        self.socket_client = SocketClient()
        self.peer = None

    def call_user(self, user_id: str):
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.call_page)
        self.socket_client.connect()

        self.peer = Peer()
        print("Peer ID")
        print(self.peer.id)
        print(self.peer.id())
        self.socket_client.callUser(user_id, self.peer.id, self.handle_call_accepted)

    def handle_call_accepted(self, data):
        print("Call was accepted yayyyyy")
        print(data)



