import sys
import asyncio
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget
from PyQt6.QtCore import QTimer
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
import socketio
from picamera_stream import PiCameraStream

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Raspberry Pi Camera Stream via WebRTC")
        self.setGeometry(0, 0, 480, 250)

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        layout = QVBoxLayout(self.central_widget)
        
        self.video_label = QLabel(self)
        layout.addWidget(self.video_label)

        self.setup_webrtc()
        
    def setup_webrtc(self):
        self.pc = RTCPeerConnection()
        self.sio = socketio.SimpleClient()
        self.sio.connect('http://127.0.0.1:5000')

        @self.sio.event
        def connect():
            print("Connected to signaling server")

        @self.sio.event
        def disconnect():
            print("Disconnected from signaling server")

        @self.sio.event
        def answer(data):
            asyncio.ensure_future(self.on_answer(data))

        @self.sio.event
        def candidate(data):
            asyncio.ensure_future(self.on_candidate(data))

        self.pc.onicecandidate = self.on_icecandidate
        self.pc.ontrack = self.on_track

    async def on_answer(self, data):
        answer = RTCSessionDescription(data['sdp'], data['type'])
        await self.pc.setRemoteDescription(answer)

    async def on_candidate(self, data):
        candidate = data['candidate']
        if candidate:
            await self.pc.addIceCandidate(candidate)

    def on_icecandidate(self, candidate):
        self.sio.emit('candidate', {'candidate': candidate})

    def on_track(self, event):
        pass  # Add code to handle received video frames if needed

    async def start_webrtc(self):
        self.pc.addTrack(PiCameraStream())
        offer = await self.pc.createOffer()
        await self.pc.setLocalDescription(offer)
        self.sio.emit('offer', {'sdp': self.pc.localDescription.sdp, 'type': self.pc.localDescription.type})

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    
    # Start the asyncio event loop
    loop = asyncio.get_event_loop()
    loop.run_until_complete(window.start_webrtc())
    
    sys.exit(app.exec())

if __name__ == "__main__":
    main()