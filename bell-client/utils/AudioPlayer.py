import av
import pyaudio
from aiortc.rtcrtpreceiver import RemoteStreamTrack


class AudioPlayer:

    def __init__(self, track: RemoteStreamTrack):
        if track.kind != 'audio':
            raise ValueError("Track must be an audio track")
        self.track = track

    async def play(self):
        audio = pyaudio.PyAudio()
        stream = audio.open(format=pyaudio.paInt16,
                                            channels=1,
                                            rate=48000,
                                            output=True)
        while self.track.readyState != 'ended':
            next_frame = await self.track.recv()
            audio_data = av.AudioFrame.to_ndarray(next_frame).tobytes()
            stream.write(audio_data)
