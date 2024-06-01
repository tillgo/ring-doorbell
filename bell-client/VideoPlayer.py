import sys
import asyncio
import numpy as np
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget
from PyQt6.QtCore import QTimer, Qt
from PyQt6.QtGui import QPixmap, QImage
from aiortc import RTCPeerConnection, VideoStreamTrack
from aiortc.contrib.signaling import BYE
from av import VideoFrame
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget
from PyQt6.QtCore import QTimer, Qt
from PyQt6.QtGui import QPixmap, QImage

class VideoStreamDisplay:
    def __init__(self, label: QLabel, video_track: VideoTrack, update_interval=30):
        self.label = label
        self.video_track = video_track

        # Initialize QTimer for periodic frame updates
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_frame)
        self.timer.start(update_interval)  # Update every 30 milliseconds

    def update_frame(self):
        frame = asyncio.run(self.video_track.recv())
        if frame is not None:
            img = frame.to_ndarray(format="rgb24")

            # Convert numpy array to QImage
            height, width, channel = img.shape
            bytes_per_line = 3 * width
            qimage = QImage(img.data, width, height, bytes_per_line, QImage.Format.Format_RGB888)

            # Convert QImage to QPixmap and display it
            pixmap = QPixmap.fromImage(qimage)
            self.label.setPixmap(pixmap)
            self.label.setAlignment(Qt.AlignmentFlag.AlignCenter)