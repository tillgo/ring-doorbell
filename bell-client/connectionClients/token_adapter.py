from requests.adapters import HTTPAdapter


class TokenAdapter(HTTPAdapter):
    """
    Custom Transport Adapter that retries failed requests.
    """

    def __init__(self):
        super().__init__()

    def send(self, request, stream=False, timeout=None, verify=True, cert=None, proxies=None):
        print("token adapter opened")
        import http_client
        client = http_client.HttpClient()
        # If not auth route, append jwts
        if not ("/api/auth" in request.url):
            token = client.get_token()
            print(token)
            request.headers['authorization'] = f"Bearer {token}"
