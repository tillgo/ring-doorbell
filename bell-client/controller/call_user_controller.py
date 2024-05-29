from connectionClients.socket_client import SocketClient


class CallUserController:

    def __init__(self, ui):
        self.ui = ui
        self.socket_client = SocketClient()

    def call_user(self, user_id: str):
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.call_page)
        self.socket_client.connect()
        # UserId of user till for testing (password testtest)
        self.socket_client.callUser("4dc66649-3b1d-426f-89f0-3df95fd02a3c", "no valid signal", self.handle_call_accepted)

    def handle_call_accepted(self, data):
        print("Call was accepted yayyyyy")
        print(data)