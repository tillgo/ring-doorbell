from datetime import datetime, timezone
import connection_information

import jwt
import requests
from requests.adapters import HTTPAdapter

from connectionClients.connection_information import token
from connectionClients.http_client import __login


class TokenAdapter(HTTPAdapter):

    """
    Custom Transport Adapter that retries failed requests.
    """
    def __init__(self):
        super().__init__()
        self.connectionInformation = connection_information.ConnectionInformation()


def send(self, request, stream=False, timeout=None, verify=True, cert=None, proxies=None):
    # If not auth route, append jwt
    if not ("/api/auth" in request.url):
        token = self.connectionInformation.get_token()
        request.headers['authorization'] = f"Bearer {token}"

