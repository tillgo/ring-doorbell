from datetime import datetime, timezone

import requests
import jwt
from connectionClients.token_adapter import TokenAdapter


class HttpClient(object):
    _instance = None
    url = "https://ring-doorbell-45675126bb6e.herokuapp.com/api"
    # ToDo Identifier und Secret einlesen (evtl. aus File)
    secret: str = "ce5e7168-ee9c-4075-9d2f-b8f6a03c3ca4"
    identifier: str = "12-34-56-78"
    session = None
    token: str = None

    # Singleton
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(HttpClient, cls).__new__(cls)

        return cls._instance

    def connect(self):
        if not self.session:
            self.session = requests.Session()
            self.session.mount("", TokenAdapter())

    def login(self):
        login_data = {'identifier': self.identifier, 'secret': self.secret}
        response = self.session.post(self.url + "/auth/bell/sign-in", json=login_data)
        print(response)
        if response.status_code != 200:
            print(response)
            # ToDO better way to handle login failure
            raise Exception("Login failed")
        return response.json()["token"]

    def get_token(self):
        if (not self.token or
                jwt.decode(self.token, options={"verify_signature": False})['exp'] < datetime.now(
                    timezone.utc).timestamp() - 30):
            self.token = self.login()

        return self.token

    def get_visitor(self, nfcCardId):
        ring_data = {'nfcCardId': nfcCardId}
        response = self.session.post(self.url + "/auth/bell/ring", json=ring_data)
        print(response)
