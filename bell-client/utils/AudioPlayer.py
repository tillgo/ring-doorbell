import asyncio

import av
import pyaudio
from aiortc.contrib.media import MediaRecorder
from aiortc.rtcrtpreceiver import RemoteStreamTrack


# class AudioPlayer:
#
#     def __init__(self, track: RemoteStreamTrack):
#         if track.kind != 'audio':
#             raise ValueError("Track must be an audio track")
#         self.track = track
#
#     async def play(self):
#         audio = pyaudio.PyAudio()
#         stream = audio.open(format=pyaudio.paInt16,
#                                             channels=2,
#                                             rate=44100,
#                                             output=True)
#         while self.track.readyState != 'ended':
#             next_frame = await self.track.recv()
#             audio_data = av.AudioFrame.to_ndarray(next_frame).tobytes()
#             stream.write(audio_data)


class AudioPlayer:
    def __init__(self, track: RemoteStreamTrack):
        if track.kind != 'audio':
            raise ValueError("Track must be an audio track")
        self.track = track

    async def play(self):
        recorder = MediaRecorder("hw:3,0", format="alsa")
        recorder.addTrack(self.track)
        await recorder.start()
        while self.track.readyState != 'ended':
            await asyncio.sleep(1)
        await recorder.stop()


