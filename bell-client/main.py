import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QPixmap
from picamera_stream import PiCameraStream

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Raspberry Pi Camera Stream")
        self.setGeometry(100, 100, 640, 480)

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        layout = QVBoxLayout(self.central_widget)
        
        self.video_label = QLabel(self)
        layout.addWidget(self.video_label)

        self.camera_stream = PiCameraStream()

        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_frame)
        self.timer.start(50)  # Update every 50 milliseconds

    def update_frame(self):
        frame = self.camera_stream.recv()
        if frame is not None:
            pixmap = QPixmap()
            pixmap.loadFromData(frame)
            self.video_label.setPixmap(pixmap)
            self.video_label.setAlignment(Qt.AlignmentFlag.AlignCenter)

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()