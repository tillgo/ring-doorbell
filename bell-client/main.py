import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget, QPushButton
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QPixmap

from controller.main_controller import MainController
from picamera_stream import PiCameraStream


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Raspberry Pi Camera Stream")
        self.setGeometry(100, 100, 480, 250)

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        layout = QVBoxLayout(self.central_widget)

        self.video_label = QLabel(self)
        layout.addWidget(self.video_label)

    def update_frame(self, pixmap):
        print("Pixmap")
        print(pixmap)
        if pixmap is not None:
            self.video_label.setPixmap(pixmap)
            self.video_label.setAlignment(Qt.AlignmentFlag.AlignCenter)


def mainTestPiCam():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    app = QApplication([])
    window = MainController()
    sys.exit(app.exec())
