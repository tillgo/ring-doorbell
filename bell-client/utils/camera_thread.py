import fractions
import time

import cv2
from PyQt6.QtCore import QThread, Qt, pyqtSignal as Signal
from PyQt6.QtGui import QImage
from PyQt6.QtWidgets import QWidget, QLabel, QApplication
from picamera2 import Picamera2, MappedArray


class CameraThread(QThread):
    frame_available = Signal(QImage)

    def __init__(self, capture_device=0, parent=None):
        super().__init__()
        self.camera = Picamera2()
        self.camera.configure(self.camera.create_preview_configuration(main={"format": "RGB888"}))
        self.camera.start()

    def run(self):
        while self.isRunning():
            frame = self.camera.capture_array()
            video_frame = VideoFrame.from_ndarray(frame, format="rgb24")
            video_frame.pts = int(time.time() * 1000000)
            video_frame.time_base = fractions.Fraction(1, 1000000)
            print("At least method works")
            print(frame)
            self.frame_available.emit(video_frame)
