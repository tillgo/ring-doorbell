import asyncio
import uuid

import socketio

from connectionClients.http_client import HttpClient


class SocketClient(object):
    _instance = None
    url = "http://192.168.22.36:5173/"
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

    def callUser(self, user_id: str, handle_call_accepted: callable):
        self.sio.emit('callClient', {'to': user_id})
        self.sio.on('callAccepted', handle_call_accepted)

    def sendRTCAnswer(self, userId, answer):
        self.sio.emit('answerSignal', {'to': userId, 'signal': {'type': answer.type,
                                                                'sdp': answer.sdp}})

