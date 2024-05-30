import asyncio

from controller.call_user_controller import CallUserController
from PyQt6.QtCore import QEventLoop


class GreetingController:

    def __init__(self, ui):
        self.ui = ui
        self.call_user_controller = CallUserController(ui)
        #UserId of user Till for testing (password testtest)
        self.ui.call_user_btn.clicked.connect(self.handle_call_user)

    def open_greeting_page(self, username: str):
        self.ui.uid_label.setText(username)
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.greeting_page)

    def handle_call_user(self):
        self.call_user_controller.call_user("4dc66649-3b1d-426f-89f0-3df95fd02a3c")
