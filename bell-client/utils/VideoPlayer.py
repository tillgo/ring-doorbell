import time
from fractions import Fraction

import av
from aiortc.contrib.media import MediaStreamTrack
from picamera2 import Picamera2


class PiCameraTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self):
        super().__init__()
        self.cam = Picamera2()
        configuration = self.cam.create_video_configuration({"size": (240, 160)}, lores={"size": (240, 160)},
                                                            controls={"FrameRate": 30.0}, buffer_count=2)
        self.prev_frame = None
        self.cam.configure(configuration)
        self.cam.start()

    async def recv(self):
        try:
            img = self.cam.capture_array()
            self.cam.drop_frames_()
            pts = time.time() * 1000000
            new_frame = av.VideoFrame.from_ndarray(img, format='rgba')
            new_frame.pts = int(pts)
            new_frame.time_base = Fraction(1, 1000000)
            self.prev_frame = new_frame
            return new_frame
        except Exception as e:
            print(e)
            return self.prev_frame

    def stop_cam(self):
        self.cam.stop()
        self.cam.close()
