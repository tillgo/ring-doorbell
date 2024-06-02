from requests.adapters import HTTPAdapter


class TokenAdapter(HTTPAdapter):
    """
    Custom Transport Adapter that appends JWT to all requests.
    """

    def __init__(self, client):
        super().__init__()
        self.client = client

    def send(self, request, stream=False, timeout=None, verify=True, cert=None, proxies=None):
        print("token adapter opened")
        # If not auth route, append jwts
        if not ("/api/auth" in request.url):
            token = self.client.get_token()
            print(token)
            request.headers['authorization'] = f"Bearer {token}"
