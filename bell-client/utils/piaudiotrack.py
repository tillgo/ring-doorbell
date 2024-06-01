import asyncio
import time
import wave
from fractions import Fraction

import av
import numpy as np
import pyaudio
from aiortc import MediaStreamTrack, AudioStreamTrack
from aiortc.contrib.media import MediaRecorder

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

    def __init__(self, rate=48000, channels=1):
        super().__init__()
        self.rate = rate
        self.channels = channels

        # Initialiser PyAudio
        self.audio = pyaudio.PyAudio()
        self.stream = self.audio.open(format=form_1, rate=samp_rate, channels=chans, \
                                      input_device_index=dev_index, input=True, \
                                      frames_per_buffer=chunk)

    async def recv(self):
        frame = self.stream.read(chunk)
        pts = time.time() * samp_rate
        audio_frame = (av.AudioFrame.
                       from_ndarray(np.frombuffer(frame, np.int16), format='s16', layout='mono'))
        audio_frame.pts = int(pts)
        audio_frame.time_base = Fraction(1, samp_rate)
        return audio_frame


if __name__ == '__main__':
    # create the audio stream track
    audio_track = PiAudioTrack()
    # create the audio file
    recorder = MediaRecorder('test.wav')
    recorder.addTrack(audio_track)

    loop = asyncio.new_event_loop()


    async def record():
        print("recording start now")
        await recorder.start()
        print("recording started")
        time1 = time.time()
        end_time = time1 + 20
        while time1 < end_time:
            time1 = time.time()

        await recorder.stop()


    loop.run_until_complete(record())
    print("finished")
