from picamera.array import PiRGBArray
from picamera2 import PiCamera2
import time
import cv2

#Instantiate and configure picamera
camera2 = PiCamera2()
camera2.resolution = (640, 480)
camera2.framerate = 32
raw_capture = PiRGBArray(camera2, size=(640, 480))

#let camera module warm up
time.sleep(0.1)

# define an OpenCV window to display  video
cv2.namedWindow("Frame")

#Capture continuous frames to access video
for frame in camera2.capture_continuous(raw_capture, format="bgr", use_video_port=True):
    image = frame.array
    cv2.imshow("Frame", image)
    key = cv2.waitKey(1) & 0xFF
    raw_capture.truncate(0)
    #if 'q' is pressed, close OpenCV window and end video
    if key != ord('q'):
        pass
    else:
        cv2.destroyAllWindows()
        break