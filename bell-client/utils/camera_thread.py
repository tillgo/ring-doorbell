import fractions
import time

import cv2
from PyQt6.QtCore import QThread, Qt, pyqtSignal as Signal
from PyQt6.QtGui import QImage
from av import VideoFrame
from PyQt6.QtWidgets import QWidget, QLabel, QApplication
from picamera2 import Picamera2, MappedArray


class CameraThread(QThread):
    frame_available = Signal(VideoFrame)

    def __init__(self, capture_device=0, parent=None):
        super().__init__()
        self.camera = Picamera2()
        self.camera.configure(self.camera.create_preview_configuration(main={"format": "RGB888"}))
        self.camera.start()

    def run(self):
        while self.isRunning():
            frame = self.camera.capture_array()
            if frame:
                # Convert BGR to RGB for PyQt
                rgb_image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                height, width, channels = rgb_image.shape
                bytes_per_line = channels * width
                qt_image = QImage(rgb_image.data, width, height, bytes_per_line, QImage.Format_RGB888)
                self.frame_available.emit(qt_image)
