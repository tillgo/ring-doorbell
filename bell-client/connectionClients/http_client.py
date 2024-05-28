from datetime import datetime, timezone

import requests
import jwt
from connectionClients.token_adapter import TokenAdapter


class HttpClient(object):
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            print('Creating the object')
            cls._instance = super(HttpClient, cls).__new__(cls)

        return cls._instance

    def __init__(self):
        self.url = ""
        # ToDo Identifier und Secret einlesen (evtl. aus File)
        self.secret: str = ""
        self.identifier: str = ""
        self.session = requests.Session()
        self.session.mount("", TokenAdapter())

    def __login(self):
        login_data = {'identifier': self.identifier, 'secretHash': self.secret}
        response = requests.post(self.url + "/auth/bell/sign-in", json=login_data)
        return response.json()["token"]
