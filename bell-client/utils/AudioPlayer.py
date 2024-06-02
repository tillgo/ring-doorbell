import pyaudio
from aiortc.rtcrtpreceiver import RemoteStreamTrack


class AudioPlayer:

    def __init__(self, track: RemoteStreamTrack):
        if track.kind != 'audio':
            raise ValueError("Track must be an audio track")
        self.track = track

        #ToDo handle Stop
        self.track.on('ended', self.stop)

    def play(self):
        audio = pyaudio.PyAudio()
        audio.open(output=True, channels=1, )




