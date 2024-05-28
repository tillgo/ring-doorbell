# https://medium.com/@ilias.info.tel/display-opencv-camera-on-a-pyqt-app-4465398546f7
import cv2
import imutils
from PyQt6.QtCore import QThread, pyqtSignal as Signal
from PyQt6.QtGui import QImage


def cvimage_to_label(image):
    image = imutils.resize(image, width=640)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = QImage(image,
                   image.shape[1],
                   image.shape[0],
                   QImage.Format_RGB888)
    return image


class MyThread(QThread):
    frame_signal = Signal(QImage)

    def run(self):
        self.cap = cv2.VideoCapture(0)
        while self.cap.isOpened():
            _, frame = self.cap.read()
            print("printing frame")
            print(frame)
            frame = cvimage_to_label(frame)
            self.frame_signal.emit(frame)
