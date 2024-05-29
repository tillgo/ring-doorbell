
class GreetingController:

    def __init__(self, ui):
        self.ui = ui
        self.ui.call_user_btn.clicked.connect(lambda: print("Call User"))

    def open_greeting_page(self, username: str):
        self.ui.uid_label.setText(username)
        self.ui.page_stacked_widget.setCurrentIndex(0)
