import asyncio

from PyQt6.QtGui import QStandardItemModel, QStandardItem
from PyQt6.QtWidgets import QListView

from connectionClients.http_client import HttpClient
from controller.call_user_controller import CallUserController
from PyQt6.QtCore import QEventLoop, QItemSelectionModel


class GreetingController:

    def __init__(self, ui):
        self.ui = ui
        self.call_user_controller = CallUserController(ui)
        self.selectedCameraUserId = ""

        self.ui.call_user_btn.clicked.connect(self.handle_call_user)

    def open_greeting_page(self, nfcCardID: str):
        httpClient = HttpClient()
        httpClient.connect()
        self.visitorData = httpClient.get_visitor(nfcCardID)
        self.ui.uid_label.setText(self.visitorData.visitor.nickname)

        # Create the model and set it to the QListView
        self.ui.model = QStandardItemModel()
        self.ui.userList.setModel(self.ui.model)
        self.ui.userList.setSelectionMode(QListView.SelectionMode.SingleSelection)
        for user in self.visitorData.possibleUsers:
            self.ui.model.appendRow(QStandardItem(user.username))
        # Get the modelindex of the first item
        model_index = self.ui.model.index(0, 0)
        # Select the item
        self.ui.userList.selectionModel().select(model_index, QItemSelectionModel.SelectionFlag.SelectCurrent)
        # Set the current index (moves the cursor to this item)
        self.ui.userList.setCurrentIndex(model_index)
        self.selectedCameraUserId = self.visitorData.possibleUsers[0].id
        self.ui.page_stacked_widget.setCurrentWidget(self.ui.greeting_page)

    def on_selection_changed(self, selected, deselected):
        # Get the selected indexes
        index = self.ui.userList.selectionModel().selectedIndex()
        # Get the model index for the item
        model_index = self.ui.model.index(selected, 0)
        self.selectedCameraUserId = self.visitorData.possibleUsers[model_index].id
        print("Selected user")
        print(self.visitorData.possibleUsers[selected].username)
        print("CameraUserID")
        print(self.selectedCameraUserId)

    def handle_call_user(self):
        #UserId of user Siggi for testing (password TestTest) (productive)
        # ("142b3e7f-1562-4335-9653-d98eac0c6f73")
        #self.call_user_controller.call_user(self.selectedCameraUserId)
        print("CameraUserID")
        print(self.selectedCameraUserId)
        self.call_user_controller.call_user("142b3e7f-1562-4335-9653-d98eac0c6f73")


