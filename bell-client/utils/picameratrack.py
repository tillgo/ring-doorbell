import time
import av
from fractions import Fraction
from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FfmpegOutput

from aiortc.contrib.media import MediaStreamTrack

cam = Picamera2()
output = FfmpegOutput('test.mp4', audio=True)
cam.configure(cam.create_video_configuration())
#encoder = H264Encoder(1000000)
#ffmpeg = FfmpegOutput(audio=True)
#encoder.output = [ffmpeg]
#cam.encoders = encoder
#cam.start()


#cam.start_encoder()

class PiCameraTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self):
        super().__init__()

    async def recv(self):
        img = cam.capture_array()

        pts = time.time() * 50000
        new_frame = av.VideoFrame.from_ndarray(img, format='rgba')
        new_frame.pts = int(pts)
        new_frame.time_base = Fraction(1, 50000)
        return new_frame
