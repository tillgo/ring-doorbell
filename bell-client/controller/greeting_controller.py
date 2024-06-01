import asyncio

from controller.call_user_controller import CallUserController
from PyQt6.QtCore import QEventLoop


class GreetingController:

    def __init__(self, ui):
        self.ui = ui
        self.call_user_controller = CallUserController(ui)

        self.ui.call_user_btn.clicked.connect(self.handle_call_user)

    def open_greeting_page(self, username: str):
        self.ui.uid_label.setText(username)
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.greeting_page)

    def handle_call_user(self):
        #UserId of user Siggi1 for testing (password testtest)
      self.call_user_controller.call_user("b9b5e449-d090-4ca3-8b4f-b0585ad908cd")


