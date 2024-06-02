import asyncio
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget, QPushButton
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QPixmap
from qasync import QEventLoop

from controller.main_controller import MainController


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Raspberry Pi Camera Stream")
        self.setGeometry(100, 100, 480, 250)

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        layout = QVBoxLayout(self.central_widget)

        self.video_label = QLabel(self)
        self.video_label.setWindowFlag(Qt.WindowType.FramelessWindowHint)
        layout.addWidget(self.video_label)

    def update_frame(self, pixmap):
        print("Pixmap")
        print(pixmap)
        if pixmap is not None:
            self.video_label.setPixmap(pixmap)
            self.video_label.setAlignment(Qt.AlignmentFlag.AlignCenter)


def mainTestPiCam():
    app = QApplication(sys.argv)
    app.setStyleSheet('Fusion')
    window = MainWindow()
    window.show()
    sys.exit(app.exec())


main_window = None

if __name__ == "__main__":
    app = QApplication([])
    event_loop = QEventLoop(app)
    asyncio.set_event_loop(event_loop)

    app_close_event = asyncio.Event()
    app.aboutToQuit.connect(lambda: app_close_event.set)

    main_window = MainController()
    with event_loop:
        event_loop.run_until_complete(app_close_event.wait())
