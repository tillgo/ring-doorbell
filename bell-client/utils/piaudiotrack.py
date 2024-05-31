import time
import wave
from fractions import Fraction
import numpy as np

import av
import pyaudio
from aiortc import MediaStreamTrack, AudioStreamTrack

# Dont worry about the many errors. This are now errors but just warnings. Everything is working fine.

# Device Index of USB-Mic: hw: 2.0 = index 3
# If not found run the following and look for USB PnP Sound Device in the output:
# >>> import pyaudio
# >>> p = pyaudio.PyAudio()
# >>> for ii in range(p.get_device_count()):
# >>>     print(p.get_device_info_by_index(ii).get('name'))

form_1 = pyaudio.paInt16  # 16-bit resolution
chans = 1  # 1 channel
samp_rate = 44100  # 44.1kHz sampling rate
chunk = 4096  # 2^12 samples for buffer
record_secs = 6  # seconds to record
dev_index = 3  # device index found by p.get_device_info_by_index(ii)
wav_output_filename = 'test1.wav'  # name of .wav file


class PiAudioTrack(MediaStreamTrack):
    kind = "audio"

    def __init__(self, rate=48000, channels=2):
        super().__init__()
        self.rate = rate
        self.channels = channels
        self._timestamp = 0

        # Initialiser PyAudio
        self.pa = pyaudio.PyAudio()
        self.stream = self.pa.open(format=pyaudio.paInt16,
                                   channels=2,
                                   rate=48000,
                                   input=True,
                                   frames_per_buffer=960)

    async def recv(self):
        frames_per_buffer = 960

        data = np.frombuffer(self.stream.read(
            frames_per_buffer), dtype=np.int16)
        data = data.reshape(-1, 1)

        self._timestamp += frames_per_buffer
        pts = self._timestamp
        time_base = Fraction(1, self.rate)
        audio_frame = av.AudioFrame.from_ndarray(
            data.T, format='s16', layout='stereo')
        audio_frame.sample_rate = self.rate
        audio_frame.pts = pts
        audio_frame.time_base = time_base
