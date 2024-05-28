import socketio

from connectionClients import connection_information
from connectionClients.connection_information import ConnectionInformation


def on_connect():
    print("connected to server")


class SocketClient(object):
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            print('Creating the object')
            cls._instance = super(SocketClient, cls).__new__(cls)

        return cls._instance

    def __init__(self):
        self.url = ""
        self.sio = socketio.Client()
        self.sio.connect(self.url, auth={"token": ConnectionInformation().get_token()})
        self.sio.on('connect', on_connect)

    def callUser(self, user_id: str):
        self.sio.emit('callClient', user_id)
