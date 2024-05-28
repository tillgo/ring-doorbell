import fractions
import time

import cv2
from aiortc import VideoStreamTrack
from av import VideoFrame
from picamera2 import Picamera2, MappedArray
import asyncio

class PiCameraStream(VideoStreamTrack):
    def __init__(self):
        super().__init__()
        self.camera = Picamera2()
        self.camera.configure(self.camera.create_preview_configuration(main={"format": "RGB888"}))
        self.camera.start()

    async def recv(self):
        frame = await asyncio.get_event_loop().run_in_executor(None, self.capture_frame)
        return frame

    def capture_frame(self):
        frame = self.camera.capture_array()
        video_frame = VideoFrame.from_ndarray(frame, format="rgb24")
        video_frame.pts = int(time.time() * 1000000)
        video_frame.time_base = fractions.Fraction(1, 1000000)
        return video_frame


if __name__ == "__main__":
    cam = PiCameraStream()
    while True:
        print("Print Frame")
        print(cam.capture_frame())
