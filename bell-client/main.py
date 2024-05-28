import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget, QPushButton
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QPixmap
from picamera_stream import PiCameraStream
from utils.camera_thread import CameraThread


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

        self.thread = CameraThread()
        self.thread.change_pixmap_signal.connect(self.update_frame)
        self.thread.start()

    def update_frame(self, pixmap):
        print("Pixmap")
        print(pixmap)
        if pixmap is not None:
            self.video_label.setPixmap(pixmap)
            self.video_label.setAlignment(Qt.AlignmentFlag.AlignCenter)

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()