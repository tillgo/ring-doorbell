import asyncio
import uuid

from aiortc import RTCPeerConnection, MediaStreamTrack, RTCConfiguration, RTCIceServer
from peerjs import peer
from peerjs.enums import PeerEventType
from peerjs.peer import Peer, PeerOptions

from connectionClients.socket_client import SocketClient


class CallUserController:

    def __init__(self, ui):
        self.ui = ui
        self.socket_client = SocketClient()
        self.peer: Peer | None = None
        self.signal_id = str(uuid.uuid4())

    def call_user(self, user_id: str):
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.call_page)
        self.socket_client.connect()

        options = PeerOptions(secure=True)
        self.peer = Peer(id=self.signal_id, peer_options=options)
        self.peer.on(PeerEventType.Open, lambda: print("Peer is open"))

        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.peer.start())

        print("Peer ID")
        print(self.peer.id)
        self.socket_client.callUser(user_id, self.peer.id, self.handle_call_accepted)

    def handle_call_accepted(self, data):
        print("Call was accepted yayyyyy")
        print(data)
        loop = asyncio.new_event_loop()
        loop.run_until_complete(self.peer.connect(data))
