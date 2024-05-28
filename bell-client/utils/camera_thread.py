import cv2
from PyQt6.QtCore import QThread, pyqtSignal
from PyQt6.QtGui import QPixmap, QImage


class CameraThread(QThread):
    change_pixmap_signal = pyqtSignal(QPixmap)

    def __init__(self):
        super().__init__()
        self.cap = cv2.VideoCapture(1)  # Change to your camera index if needed
        print("Open?:")
        print(self.cap.isOpened())

    def run(self):
        while True:
            ret, frame = self.cap.read()

            if ret:
                rgb_image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                height, width, ch = rgb_image.shape
                bytes_per_line = 3 * width
                qimg = QImage(rgb_image.data, width, height, bytes_per_line, QImage.Format.Format_RGB888)
                pixmap = QPixmap(qimg)
                self.change_pixmap_signal.emit(pixmap)

            if cv2.waitKey(1) == ord('q'):
                break

        # Clean up resources
        self.cap.release()
