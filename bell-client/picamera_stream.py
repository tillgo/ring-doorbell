from PyQt6.QtWidgets import QApplication QMainWindow
from picamera2.previews.qt import QGlPicamera2
from picamera2 import Picamera2
import sys


def main():

    # Create the QApplication instance
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()

    # Initialize Picamera2
    picam2 = Picamera2()
    picam2.configure(picam2.create_preview_configuration())

    # Create the QGlPicamera2 widget
    qpicamera2 = QGlPicamera2(picam2, width=800, height=600, keep_ar=False)
    qpicamera2.setWindowTitle("Qt Picamera2 App")

    # Start the camera and show the widget
    picam2.start()
    qpicamera2.show()

    # Execute the application
    sys.exit(app.exec())


if __name__ == "__main__":
    main()