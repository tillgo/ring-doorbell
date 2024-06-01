import time
import av
from fractions import Fraction
from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FfmpegOutput

from aiortc.contrib.media import MediaStreamTrack

#output = FfmpegOutput('test.mp4', audio=True)


# encoder = H264Encoder(1000000)
# ffmpeg = FfmpegOutput(audio=True)
# encoder.output = [ffmpeg]
# cam.encoders = encoder


# cam.start_encoder()

class PiCameraTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self):
        super().__init__()
        self.cam = Picamera2()
        configuration = self.cam.create_video_configuration({"size": (240, 160)}, lores={"size": (240, 160)},
                                                            controls={"FrameRate": 30.0}, buffer_count=2)
        self.cam.configure(configuration)
        self.cam.start()

    async def recv(self):
        img = self.cam.capture_array()
        self.cam.drop_frames_()
        pts = time.time() * 1000000
        new_frame = av.VideoFrame.from_ndarray(img, format='rgba')
        new_frame.pts = int(pts)
        new_frame.time_base = Fraction(1, 1000000)
        return new_frame
