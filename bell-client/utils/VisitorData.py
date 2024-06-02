from datetime import datetime


# Define the Visitor class
class Visitor:
    def __init__(self, nfcCardId, id, createdAt, deviceId, nickname, isWhitelisted):
        self.nfcCardId = nfcCardId
        self.id = id
        self.createdAt = datetime.fromisoformat(createdAt) if isinstance(createdAt, str) else createdAt
        self.deviceId = deviceId
        self.nickname = nickname
        self.isWhitelisted = isWhitelisted


# Define the PossibleUser class
class PossibleUser:
    def __init__(self, id, username, createdAt):
        self.id = id
        self.username = username
        self.createdAt = datetime.fromisoformat(createdAt) if isinstance(createdAt, str) else createdAt


# Define the RingData class
class VisitorData:
    def __init__(self, data):
        visitor_data = data.get('visitor', {})
        self.visitor = Visitor(
            visitor_data.get('nfcCardId', ''),
            visitor_data.get('id', ''),
            visitor_data.get('createdAt', datetime.now()),
            visitor_data.get('deviceId', ''),
            visitor_data.get('nickname', ''),
            visitor_data.get('isWhitelisted', False)
        )

        self.possibleUsers = []
        for user_data in data.get('possibleUsers', []):
            user = PossibleUser(
                user_data.get('id', ''),
                user_data.get('username', ''),
                user_data.get('createdAt', datetime.now())
            )
            self.possibleUsers.append(user)