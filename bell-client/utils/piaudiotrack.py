import pyaudio
from aiortc import MediaStreamTrack


class PiAudioTrack(MediaStreamTrack):
    kind = "audio"

    def __init__(self):
        super().__init__()

    async def recv(self):
        pass





if __name__ == '__main__':
    p = pyaudio.PyAudio()
    for ii in range(p.get_device_count()):
        print(p.get_device_info_by_index(ii).get('name'))