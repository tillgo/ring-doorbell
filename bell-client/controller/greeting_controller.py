import asyncio

from connectionClients.http_client import HttpClient
from controller.call_user_controller import CallUserController
from PyQt6.QtCore import QEventLoop


class GreetingController:

    def __init__(self, ui):
        self.ui = ui
        self.call_user_controller = CallUserController(ui)

        self.ui.call_user_btn.clicked.connect(self.handle_call_user)

    def open_greeting_page(self, nfcCardID: str):
        httpClient = HttpClient()
        httpClient.get_visitor(nfcCardID)
        self.ui.uid_label.setText(nfcCardID)
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.greeting_page)

    def handle_call_user(self):
        #UserId of user Siggi for testing (password TestTest) (productive)
      self.call_user_controller.call_user("142b3e7f-1562-4335-9653-d98eac0c6f73")


