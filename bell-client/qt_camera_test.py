import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget
from picamera2.previews.qt import QGlPicamera2
from picamera2 import Picamera2

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Welcome Application")
        self.setGeometry(100, 100, 480, 320)

        # Central widget
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)

        # Layout
        layout = QVBoxLayout(self.central_widget)

        # Welcome label
        self.welcome_label = QLabel("Welcome to Raspberry Pi!")
        self.welcome_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.welcome_label)
        print("Welcome label built")

        picam2 = Picamera2()
        print("picam initialized")
        picam2.configure(picam2.create_preview_configuration())
        print("picam configured")
        picam2.start()
        print("picam started")

        #Camera Preview
        self.camera_preview = qpicamera2 = QGlPicamera2(picam2, width=800, height=600, keep_ar=False)
        print("widget built")
        layout.addWidget(self.camera_preview)
        print("widget added")

def main():
    app = QApplication(sys.argv)
    print("QApp built")
    window = MainWindow()
    print("Mainwindow built")
    window.show()
    print("mainwindow shown")
    sys.exit(app.exec())