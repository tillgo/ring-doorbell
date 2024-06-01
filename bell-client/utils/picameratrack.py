import time
from multiprocessing import Process

import av
from fractions import Fraction
from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FfmpegOutput

from aiortc.contrib.media import MediaStreamTrack

output = FfmpegOutput('test.mp4', audio=True)

#encoder = H264Encoder(1000000)
#ffmpeg = FfmpegOutput(audio=True)
#encoder.output = [ffmpeg]
#cam.encoders = encoder


#cam.start_encoder()

frames = []


def record_frames():
    cam = Picamera2()
    cam.configure(cam.create_video_configuration())
    cam.start()
    while True:
        img = cam.capture_array()
        pts = time.time() * 60
        new_frame = av.VideoFrame.from_ndarray(img, format='rgba')
        new_frame.pts = int(pts)
        new_frame.time_base = Fraction(1, 60)
        frames.append(new_frame)


class PiCameraTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self):
        super().__init__()
        video_thread = Process(target=record_frames)
        video_thread.start()

    async def recv(self):
        while True:
            if len(frames) > 0:
                new_frame = frames.pop()
                print("returning frane")
                print(new_frame)
                return new_frame

