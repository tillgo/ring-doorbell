import asyncio

from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QWidget
from qasync import QEventLoop

from controller.main_controller import MainController

if __name__ == "__main__":
    app = QApplication([])
    app.setStyle('Fusion')
    event_loop = QEventLoop(app)
    asyncio.set_event_loop(event_loop)

    app_close_event = asyncio.Event()
    app.aboutToQuit.connect(lambda: app_close_event.set)

    main_window = MainController()
    with event_loop:
        event_loop.run_until_complete(app_close_event.wait())
