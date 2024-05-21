from PyQt6.QtWidgets import QMainWindow

import main_window
from controller.ring_controller import wait_for_nfc_id


class MainController(QMainWindow):
    def __init__(self):
        super().__init__()

        self.ui = main_window.Ui_MainWindow()
        self.ui.setupUi(self)

        wait_for_nfc_id(self.handle_nfc_id_found)

        self.show()

    def start_app(self):
        wait_for_nfc_id(self.handle_nfc_id_found)

    def handle_nfc_id_found(self, uid):
        self.ui.uid_label.setText("".join([hex(i) for i in uid]))
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.greeting_page)
