import asyncio


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
        asyncio.run(self.startCountdown())

    async def startCountdown(self):
        while self.countdown > 0:
            await asyncio.sleep(1)
            self.countdown -= 1
            self.ui.countdown.setText(str(self.countdown))

        await asyncio.sleep(0.5)
        self.main_controller.start_app()
