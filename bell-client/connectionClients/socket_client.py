import socketio

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
        print("Call user")
        self.sio.emit('callClient', {'to': user_id, 'signalData': signal_data})
        self.sio.on('callAccepted', handle_call_accepted)


if __name__ == "__main__":
    client = SocketClient()
    client.connect()
    client1 = SocketClient()
    client1.connect()
