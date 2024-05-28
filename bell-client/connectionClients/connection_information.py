from datetime import datetime, timezone

import jwt

from connectionClients.http_client import __login


class ConnectionInformation(object):
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            print('Creating the object')
            cls._instance = super(ConnectionInformation, cls).__new__(cls)

        return cls._instance

    def __init__(self):

    def get_token(self):
        if (not self.token or
                jwt.decode(self.token, options={"verify_signature": False})['exp'] < datetime.now(
                    timezone.utc).timestamp() - 30):
            self.token = __login()
        return self.token
