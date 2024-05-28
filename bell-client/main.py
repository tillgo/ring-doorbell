import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QPixmap
from picamera_stream import PiCameraStream
from utils.camera_thread import MyThread


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Raspberry Pi Camera Stream")
        self.setGeometry(0, 0, 480, 250)

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        layout = QVBoxLayout(self.central_widget)

        self.video_label = QLabel(self)
        layout.addWidget(self.video_label)

        self.camera_thread = MyThread()
        self.camera_thread.frame_signal.connect(self.update_frame)
        self.camera_thread.start()

    async def update_frame(self, image):
        self.video_label.setPixmap(QPixmap.fromImage(image))


def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
