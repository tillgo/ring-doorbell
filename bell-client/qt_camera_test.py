import sys
import cv2
import numpy as np
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QPushButton, QGraphicsOpacityEffect
from PyQt6.QtGui import QImage, QPixmap
from PyQt6.QtCore import Qt, QTimer
from picamera2 import Picamera2
from libcamera import controls
import io


class CameraApp(QMainWindow):
    def __init__(self):
        super().__init__()

        # Initialize Picamera2
        self.picam2 = Picamera2()
        config = self.picam2.create_preview_configuration(main={"size": (800, 480), "format": "RGB888"})
        self.picam2.configure(config)

        # Enable autofocus
        #self.picam2.set_controls({"AfMode": controls.AfModeEnum.Continuous})

        # Start the camera
        self.picam2.start()

        # Create a label to display the camera feed
        self.camera_label = QLabel(self)
        self.camera_label.setGeometry(0, 0, 800, 480)

        # Create a button to toggle the mirror effect
        self.toggle_button = QPushButton("Toggle Mirror Effect", self)
        self.toggle_button.setGeometry(600, 430, 200, 50)
        self.toggle_button.setStyleSheet("background-color: white; color: black; font-size: 18px;")

        # Create a close button
        self.close_button = QPushButton("Close", self)
        self.close_button.setGeometry(700, 10, 90, 40)
        self.close_button.setStyleSheet("background-color: red; color: white; font-size: 18px;")

        # Create opacity effect for toggle button
        toggle_opacity_effect = QGraphicsOpacityEffect(self.toggle_button)
        toggle_opacity_effect.setOpacity(0.7)
        self.toggle_button.setGraphicsEffect(toggle_opacity_effect)

        # Connect the button to the toggle function
        self.toggle_button.clicked.connect(self.toggle_mirror_effect)
        self.close_button.clicked.connect(self.close_application)

        # Flag to keep track of the mirror effect state
        self.mirror_effect = False

        # Create a QTimer to update the camera feed
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_camera_feed)
        self.timer.start(30)  # Update the feed every 30 ms

        # Set full screen
        self.showFullScreen()

    def toggle_mirror_effect(self):
        """
        Toggle the mirror effect on or off.
        """
        self.mirror_effect = not self.mirror_effect

    def close_application(self):
        """
        Close the application.
        """
        self.timer.stop()  # Stop the QTimer
        self.picam2.stop()  # Stop the camera
        QApplication.quit()  # Close the application

    def update_camera_feed(self):
        frame = self.picam2.capture_array()
        if frame is not None:
            # Convert frame from RGB to BGR (OpenCV format)
            frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

            # Ensure frame is in RGB format and convert to QImage
            height, width, channel = frame.shape
            bytes_per_line = 1 * width
            qimage = QImage(frame_bgr.data, width, height, bytes_per_line, QImage.Format.Format_RGB888)

            # Convert QImage to QPixmap and display it
            pixmap = QPixmap.fromImage(qimage)
            self.camera_label.setPixmap(pixmap)

    def closeEvent(self, event):
        self.timer.stop()  # Stop the QTimer
        self.picam2.stop()  # Stop the camera
        event.accept()


# Run the application
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = CameraApp()
    window.show()
    sys.exit(app.exec())