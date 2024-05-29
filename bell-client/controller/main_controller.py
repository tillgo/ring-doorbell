import threading

from PyQt6.QtWidgets import QMainWindow

import main_window
from controller.greeting_controller import GreetingController
from controller.ring_controller import wait_for_nfc_id


class MainController(QMainWindow):
    def __init__(self):
        super().__init__()

        self.ui = main_window.Ui_MainWindow()

        self.greetingController = GreetingController(self.ui)

        self.ui.setupUi(self)
        self.ui.pushButton.clicked.connect(lambda: print("Button clicked"))
        self.show()
        # start waiting for nfc id in new thread
        t1 = threading.Thread(target=self.start_app)
        t1.start()

    def start_app(self):
        # ToDo cancel methode, if "i have no card" button is clicked
        wait_for_nfc_id(self.handle_nfc_id_found)

    def handle_nfc_id_found(self, uid):
        self.greetingController.open_greeting_page("".join([hex(i) for i in uid]))
