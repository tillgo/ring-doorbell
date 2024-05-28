import cv2
from picamera2 import Picamera2


def main():
    # Initialize Picamera2
    picam2 = Picamera2()
    config = picam2.create_preview_configuration(main={"format": "RGB888"})
    picam2.configure(config)
    picam2.start()

    while True:
        # Capture frame-by-frame
        frame = picam2.capture_array()

        # Display the resulting frame
        cv2.imshow('Raspberry Pi Camera Stream', frame)

        # Break the loop on 'q' key press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # When everything is done, release the capture and close windows
    picam2.stop()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
