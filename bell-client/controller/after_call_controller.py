import asyncio
import sys

from PyQt6.uic.properties import QtCore

messages = {
    'failed': 'Call failed (User not online)',
    'ended': 'Call ended',
    'denied': 'Call denied'
}


class AfterCallController:
    """
    Constructor
    message_type: 'failed' | 'ended' | 'denied'
    """

    def __init__(self, end_type: str, ui, main_controller):
        self.message_type = end_type
        self.ui = ui
        self.main_controller = main_controller
        self.ui.call_end_message.setText(messages[end_type])
        self.countdown: int = 3
        self.ui.countdown.setText(str(self.countdown))
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.after_call_page)
        QtCore.QCoreApplication.quit()
        status = QtCore.QProcess.startDetached(sys.executable, sys.argv)
        print(status)
        self.main_controller.start_app()



