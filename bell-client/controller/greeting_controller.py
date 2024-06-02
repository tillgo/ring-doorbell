import asyncio

from PyQt6.QtGui import QStandardItemModel, QStandardItem
from PyQt6.QtWidgets import QListView

from connectionClients.http_client import HttpClient
from controller.call_user_controller import CallUserController
from PyQt6.QtCore import QEventLoop, QItemSelectionModel, Qt


class GreetingController:

    def __init__(self, ui, main_controller):
        self.visitorData = None
        self.ui = ui
        self.main_controller = main_controller
        self.call_user_controller = CallUserController(ui, self.main_controller)
        self.selectedCameraUserId = ""

        self.ui.call_user_btn.clicked.connect(self.handle_call_user)

    def open_greeting_page(self, nfcCardID: str):
        httpClient = HttpClient()
        httpClient.connect()
        self.visitorData = httpClient.get_visitor(nfcCardID)
        self.ui.uid_label.setText(self.visitorData.visitor.nickname)

        for user in self.visitorData.possibleUsers:
            self.ui.userList.addItem(user.username)
        # Select the first possible user
        self.selectedCameraUserId = self.visitorData.possibleUsers[self.ui.userList.currentRow()].id
        self.ui.userList.currentItemChanged.connect(self.on_current_changed)
        self.ui.userList.setCurrentRow(0)

        self.ui.page_stacked_widget.setCurrentWidget(self.ui.greeting_page)

    def on_current_changed(self, current, previous):
        print("current changed")
        # Get the row index as an integer
        index = self.ui.userList.currentRow
        print("Current row index" + index)
        selected_item = self.ui.userList.currentItem()
        if selected_item is not None:
            print("Selected item:", selected_item.text())

        # Access the corresponding item from your data model using the integer index
        self.selectedCameraUserId = self.visitorData.possibleUsers[index].id
        print("Selected user")
        print(self.visitorData.possibleUsers[index].username)
        print("CameraUserID")
        print(self.selectedCameraUserId)


    def handle_call_user(self):
        #UserId of user Siggi for testing (password TestTest) (productive)
        # ("142b3e7f-1562-4335-9653-d98eac0c6f73")
        #self.call_user_controller.call_user(self.selectedCameraUserId)
        print("CameraUserID")
        print(self.selectedCameraUserId)
        self.call_user_controller.call_user("142b3e7f-1562-4335-9653-d98eac0c6f73")


