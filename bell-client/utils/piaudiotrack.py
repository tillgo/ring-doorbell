import wave

import pyaudio
from aiortc import MediaStreamTrack

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

    def __init__(self):
        super().__init__()
        self.audio = pyaudio.PyAudio()
        stream = audio.open(format=form_1, rate=samp_rate, channels=chans,
                            input=True,
                            frames_per_buffer=chunk)

    async def recv(self):
        return stream.read(chunk)


if __name__ == '__main__':
    form_1 = pyaudio.paInt16  # 16-bit resolution
    chans = 1  # 1 channel
    samp_rate = 44100  # 44.1kHz sampling rate
    chunk = 4096  # 2^12 samples for buffer
    record_secs = 6  # seconds to record
    dev_index = 3  # device index found by p.get_device_info_by_index(ii)
    wav_output_filename = 'test1.wav'  # name of .wav file

    audio = pyaudio.PyAudio()  # create pyaudio instantiation

    # create pyaudio stream
    stream = audio.open(format=form_1, rate=samp_rate, channels=chans,
                        output_device_index=dev_index, input=True,
                        frames_per_buffer=chunk)
    print("recording")
    frames = []

    # loop through stream and append audio chunks to frame array
    for ii in range(0, int((samp_rate / chunk) * record_secs)):
        data = stream.read(chunk)
        frames.append(data)

    print("finished recording")

    # stop the stream, close it, and terminate the pyaudio instantiation
    stream.stop_stream()
    stream.close()
    audio.terminate()

    # save the audio frames as .wav file
    wavefile = wave.open(wav_output_filename, 'wb')
    wavefile.setnchannels(chans)
    wavefile.setsampwidth(audio.get_sample_size(form_1))
    wavefile.setframerate(samp_rate)
    wavefile.writeframes(b''.join(frames))
    wavefile.close()
