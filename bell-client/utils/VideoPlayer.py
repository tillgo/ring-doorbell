import sys
import asyncio
import numpy as np
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget
from PyQt6.QtCore import QTimer, Qt
from PyQt6.QtGui import QPixmap, QImage
from aiortc import RTCPeerConnection, VideoStreamTrack
from aiortc.contrib.signaling import BYE
from aiortc.rtcrtpreceiver import RemoteStreamTrack
from av import VideoFrame
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget
from PyQt6.QtCore import QTimer, Qt
from PyQt6.QtGui import QPixmap, QImage


class VideoStreamDisplay:
    def __init__(self, label: QLabel, video_track: RemoteStreamTrack, update_interval=30):
        self.videoLabel = label
        self.video_track = video_track

    async def show_video(self):
        while self.video_track.readyState != 'ended':
            await self.update_frame()

    async def update_frame(self):
        frame = await self.video_track.recv()
        if frame is not None:
            img = frame.to_ndarray(format="rgb24")

            # Convert numpy array to QImage
            height, width, channel = img.shape
            bytes_per_line = 3 * width
            qimage = QImage(img.data, width, height, bytes_per_line, QImage.Format.Format_RGB888)

            # Convert QImage to QPixmap and display it
            pixmap = QPixmap.fromImage(qimage)
            self.videoLabel.setPixmap(pixmap)
            self.videoLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
            self.videoLabel.showFullScreen()
