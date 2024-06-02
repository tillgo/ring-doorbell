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

    def __init__(self, message_type: str, ui):
        self.message_type = message_type
        self.ui = ui
        self.ui.call_end_message.setText(messages[message_type])
        self.countdown: int = 3
        self.ui.countdown.setText(str(self.countdown))
        asyncio.run(self.startCountdown())
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.after_call_page)

    async def startCountdown(self):
        while self.countdown > 0:
            await asyncio.sleep(1)
            self.countdown -= 1
            self.ui.countdown.setText(str(self.countdown))

        await asyncio.sleep(0.5)
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.ring_page)
        self.ui.call_end_message.setText('')
