import asyncio

import av
import pyaudio
from aiortc.contrib.media import MediaRecorder
from aiortc.rtcrtpreceiver import RemoteStreamTrack


class AudioPlayer:
    def __init__(self, track: RemoteStreamTrack):
        if track.kind != 'audio':
            raise ValueError("Track must be an audio track")
        self.track = track
        self.recorder: MediaRecorder | None = None

    async def play(self):
        self.recorder = MediaRecorder("hw:3,0", format="alsa")
        self.recorder.addTrack(self.track)
        await self.recorder.start()
        while self.track.readyState != 'ended':
            await asyncio.sleep(1)
        await self.recorder.stop()

    def stop(self):
        self.recorder.stop()
