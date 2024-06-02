import threading

from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QMainWindow

from controller.greeting_controller import GreetingController
from controller.ring_controller import wait_for_nfc_id
from view import main_window


class MainController(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowFlag(Qt.WindowType.FramelessWindowHint)
        self.greetingController = None
        self.show()
        self.start_app()

    def start_app(self):
        ui = main_window.Ui_MainWindow()
        ui.setupUi(self)
        self.greetingController = GreetingController(ui, self)
        ui.page_stacked_widget.setCurrentWidget(ui.ring_page)
        # start waiting for nfc id in new thread
        t1 = threading.Thread(target=wait_for_nfc_id, args=(self.handle_nfc_id_found,))
        t1.start()

    def handle_nfc_id_found(self, uid):
        self.greetingController.open_greeting_page("".join([hex(i) for i in uid]))
