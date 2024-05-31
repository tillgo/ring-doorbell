import time
import av
from fractions import Fraction
from picamera2 import Picamera2

from aiortc.contrib.media import MediaStreamTrack

cam = Picamera2()
cam.configure(cam.create_video_configuration())
cam.start()

class PiCameraTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self):
        super().__init__()

    async def recv(self):
        img = cam.capture_array()

        pts = time.time() * 1000000
        new_frame = av.VideoFrame.from_ndarray(img, format='rgba')
        new_frame.pts = int(pts)
        new_frame.time_base = Fraction(1,1000000)
        return new_frame