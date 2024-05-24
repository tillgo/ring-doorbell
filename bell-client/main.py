import sys

from PyQt6.QtWidgets import QApplication, QMainWindow

from controller.main_controller import MainController
from view import main_window

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainController()
    sys.exit(app.exec())
