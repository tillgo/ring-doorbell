import cv2
from PyQt6.QtCore import QThread, Qt, pyqtSignal as Signal
from PyQt6.QtGui import QImage
from PyQt6.QtWidgets import QWidget, QLabel, QApplication


class CameraThread(QThread):
    frame_available = Signal(QImage)

    def __init__(self, capture_device=0, parent=None):
        super().__init__(parent)
        self.cap = cv2.VideoCapture(capture_device)

    def run(self):
        while self.isRunning():
            ret, frame = self.cap.read()
            print("At least method works")
            if ret:
                print("There is a frame")
                print(frame)
                # Convert BGR to RGB for PyQt
                rgb_image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                height, width, channels = rgb_image.shape
                bytes_per_line = channels * width
                qt_image = QImage(rgb_image.data, width, height, bytes_per_line, QImage.Format_RGB888)
                self.frame_available.emit(qt_image)
