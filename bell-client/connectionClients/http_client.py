import json
from datetime import datetime, timezone

import requests
import jwt
from connectionClients.token_adapter import TokenAdapter
from utils.VisitorData import VisitorData


class HttpClient(object):
    _instance = None
    url = "https://ring-doorbell-45675126bb6e.herokuapp.com/api"

    # For this prototype the secret and identifier are hardcoded here,
    # in reality this probably should read from a file or sos
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
            self.session.mount("http://", TokenAdapter(self))
            self.session.mount("https://", TokenAdapter(self))

    def login(self):
        login_data = {'identifier': self.identifier, 'secret': self.secret}
        response = self.session.post(self.url + "/auth/bell/sign-in", json=login_data)
        if response.status_code != 200:
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
        response = self.session.post(self.url + "/bell/ring", json=ring_data)
        print("Asked for ring_data")
        print(response.status_code)
        print(response.json())
        visitor_data = response.json()
        visitorData = VisitorData(visitor_data)
        return visitorData