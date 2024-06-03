import asyncio
import threading

from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QMainWindow

from connectionClients.socket_client import SocketClient
from controller.greeting_controller import GreetingController
from controller.ring_controller import wait_for_nfc_id
from view import main_window


class MainController(QMainWindow):
    def __init__(self):
        super().__init__()
        self.ui = main_window.Ui_MainWindow()
        self.ui.setupUi(self)
        self.setWindowFlag(Qt.WindowType.FramelessWindowHint)
        self.greetingController = GreetingController(self.ui, self)
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.ring_page)
        self.show()
        self.start_app()

    def start_app(self):
        # start waiting for nfc id in new thread
        uid = asyncio.run(wait_for_nfc_id())
        self.handle_nfc_id_found(uid)

    def handle_nfc_id_found(self, uid):
        self.greetingController.open_greeting_page("".join([hex(i) for i in uid]))
