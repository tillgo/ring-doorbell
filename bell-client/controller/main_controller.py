import threading

from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QMainWindow

from connectionClients.socket_client import SocketClient
from controller.greeting_controller import GreetingController
from controller.ring_controller import wait_for_nfc_id
from view import main_window


class MainController:
    def __init__(self):
        super().__init__()
        self.main_window = QMainWindow()
        self.ui = main_window.Ui_MainWindow()
        self.greetingController = None
        self.t1 = None
        self.start_app()

    def start_app(self):
        layout = self.main_window.layout()
        for i in reversed(range(layout.count())):
            layout.itemAt(i).widget().setParent(None)
        self.ui.setupUi(self.main_window)
        self.main_window.setWindowFlag(Qt.WindowType.FramelessWindowHint)
        self.greetingController = GreetingController(self.ui, self)
        self.main_window.show()

        self.ui.page_stacked_widget.setCurrentWidget(self.ui.ring_page)
        # start waiting for nfc id in new thread
        wait_for_nfc_id(self.handle_nfc_id_found)

    def handle_nfc_id_found(self, uid):
        print("card found yayyyy")
        self.greetingController.open_greeting_page("".join([hex(i) for i in uid]))
