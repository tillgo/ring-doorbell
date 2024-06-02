import asyncio

from PyQt6.QtGui import QStandardItemModel, QStandardItem
from PyQt6.QtWidgets import QListView

from connectionClients.http_client import HttpClient
from controller.call_user_controller import CallUserController
from PyQt6.QtCore import QEventLoop, QItemSelectionModel, Qt


class GreetingController:

    def __init__(self, ui, main_controller):
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

        # Create the model and set it to the QListView
        self.ui.model = QStandardItemModel()
        self.ui.userList.setModel(self.ui.model)
        self.ui.userList.setFocusPolicy(Qt.FocusPolicy.StrongFocus)  # or ClickFocus
        self.ui.userList.setSelectionMode(QListView.SelectionMode.SingleSelection)
        self.ui.userList.selectionModel().currentChanged.connect(self.on_current_changed)

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

    def on_current_changed(self, current, previous):
        print("current changed")
        # Check if a valid current index is available
        if current.isValid():
            # Get the row index as an integer
            index = current.row()
            print(index)
            # Access the corresponding item from your data model using the integer index
            self.selectedCameraUserId = self.visitorData.possibleUsers[index].id
            print("Selected user")
            print(self.visitorData.possibleUsers[index].username)
            print("CameraUserID")
            print(self.selectedCameraUserId)
        else:
            print("current is not valid")

    def handle_call_user(self):
        #UserId of user Siggi for testing (password TestTest) (productive)
        # ("142b3e7f-1562-4335-9653-d98eac0c6f73")
        #self.call_user_controller.call_user(self.selectedCameraUserId)
        print("CameraUserID")
        print(self.selectedCameraUserId)
        self.call_user_controller.call_user("142b3e7f-1562-4335-9653-d98eac0c6f73")


