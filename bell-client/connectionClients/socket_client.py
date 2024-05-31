import asyncio
import uuid

import socketio
from peerjs.peer import PeerOptions, Peer, PeerConnectOption

from connectionClients.http_client import HttpClient


class SocketClient(object):
    _instance = None
    url = "http://192.168.22.36:8080"
    sio = None

    # Singleton
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SocketClient, cls).__new__(cls)

        return cls._instance

    def connect(self):
        if not self.sio:
            self.sio = socketio.Client()
            httpClient = HttpClient()
            httpClient.connect()
            self.sio.connect(self.url, auth={"jwt": httpClient.get_token()})
            self.sio.on('connect', lambda: print("connected to server"))
            self.sio.on('disconnect', lambda: self.onDisconnect)

    def onDisconnect(self):
        # ToDo überlegen, wie mit ungewollten Disconnect umgehen
        print("Disconnected from server")
        self.sio = None

    def callUser(self, user_id: str, signal_data: str, handle_call_accepted: callable):
        self.sio.emit('callClient', {'to': user_id, 'signalData': signal_data})
        self.sio.on('callAccepted', handle_call_accepted)

    def sendIceCandidate(self, userId, iceCandidate):
        self.sio.emit('iceCandidate', {'to': userId, 'candidate': iceCandidate})

    def sendRTCAnswer(self, userId, answer):
        self.sio.emit('answerSignal', {'to': userId, 'signal': {'type': answer.type, 'sdp': answer.sdp}})


class Test:
    def __init__(self, test):
        self.test = test


if __name__ == "__main__":
    client = SocketClient()
    client.connect()
    client.callUser("4dc66649-3b1d-426f-89f0-3df95fd02a3c", "test", lambda: print("call accepted"))
