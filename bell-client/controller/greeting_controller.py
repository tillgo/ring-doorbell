from connectionClients.http_client import HttpClient
from controller.call_user_controller import CallUserController


class GreetingController:

    def __init__(self, ui, main_controller):
        self.visitorData = None
        self.ui = ui
        self.main_controller = main_controller
        self.call_user_controller = CallUserController(ui, self.main_controller)
        self.selectedCameraUserId = ""

        self.ui.call_user_btn.clicked.connect(self.handle_call_user)

    def open_greeting_page(self, nfcCardID: str):
        print("page opened yay")
        httpClient = HttpClient()
        httpClient.connect()
        self.visitorData = httpClient.get_visitor(nfcCardID)
        self.ui.uid_label.setText(self.visitorData.visitor.nickname)
        self.ui.userList.clear()
        for user in self.visitorData.possibleUsers:
            self.ui.userList.addItem(user.username)
        # Select the first possible user
        self.ui.userList.selectionModel().setCurrentIndex(0)

        self.ui.page_stacked_widget.setCurrentWidget(self.ui.greeting_page)

    def handle_call_user(self):
        #UserId of user Siggi for testing (password TestTest) (productive)
        # ("142b3e7f-1562-4335-9653-d98eac0c6f73")
        #self.call_user_controller.call_user(self.selectedCameraUserId)
        index = self.ui.userList.currentRow()
        user = self.visitorData.possibleUsers[index]
        print("Username: " + user.username)
        print("ID: " + user.id)
        self.call_user_controller.call_user(user.id)
