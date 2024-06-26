# Form implementation generated from reading ui file './ui-designer/Main-Window.ui'
#
# Created by: PyQt6 UI code generator 6.7.0
#
# WARNING: Any manual changes made to this file will be lost when pyuic6 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt6 import QtCore, QtGui, QtWidgets


class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(480, 320)
        MainWindow.setMaximumSize(QtCore.QSize(480, 320))
        self.centralwidget = QtWidgets.QWidget(parent=MainWindow)
        self.centralwidget.setMinimumSize(QtCore.QSize(480, 320))
        self.centralwidget.setObjectName("centralwidget")
        self.main_frame = QtWidgets.QFrame(parent=self.centralwidget)
        self.main_frame.setGeometry(QtCore.QRect(0, 0, 480, 320))
        self.main_frame.setMaximumSize(QtCore.QSize(480, 320))
        self.main_frame.setFrameShape(QtWidgets.QFrame.Shape.StyledPanel)
        self.main_frame.setFrameShadow(QtWidgets.QFrame.Shadow.Raised)
        self.main_frame.setObjectName("main_frame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.main_frame)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.page_stacked_widget = QtWidgets.QStackedWidget(parent=self.main_frame)
        self.page_stacked_widget.setObjectName("page_stacked_widget")
        self.greeting_page = QtWidgets.QWidget()
        self.greeting_page.setObjectName("greeting_page")
        self.uid_label = QtWidgets.QLabel(parent=self.greeting_page)
        self.uid_label.setGeometry(QtCore.QRect(30, 80, 161, 18))
        self.uid_label.setObjectName("uid_label")
        self.greeting_label = QtWidgets.QLabel(parent=self.greeting_page)
        self.greeting_label.setGeometry(QtCore.QRect(30, 50, 161, 18))
        self.greeting_label.setObjectName("greeting_label")
        self.call_user_btn = QtWidgets.QPushButton(parent=self.greeting_page)
        self.call_user_btn.setGeometry(QtCore.QRect(30, 130, 87, 26))
        self.call_user_btn.setObjectName("call_user_btn")
        self.label_2 = QtWidgets.QLabel(parent=self.greeting_page)
        self.label_2.setGeometry(QtCore.QRect(280, 20, 111, 16))
        self.label_2.setObjectName("label_2")
        self.userList = QtWidgets.QListWidget(parent=self.greeting_page)
        self.userList.setGeometry(QtCore.QRect(270, 40, 161, 191))
        self.userList.setObjectName("userList")
        self.page_stacked_widget.addWidget(self.greeting_page)
        self.call_page = QtWidgets.QWidget()
        self.call_page.setObjectName("call_page")
        self.video_label = QtWidgets.QLabel(parent=self.call_page)
        self.video_label.setGeometry(QtCore.QRect(-10, -10, 481, 321))
        self.video_label.setAlignment(QtCore.Qt.AlignmentFlag.AlignCenter)
        self.video_label.setObjectName("video_label")
        self.page_stacked_widget.addWidget(self.call_page)
        self.ring_page = QtWidgets.QWidget()
        self.ring_page.setObjectName("ring_page")
        self.nfc_scan_label = QtWidgets.QLabel(parent=self.ring_page)
        self.nfc_scan_label.setGeometry(QtCore.QRect(180, 140, 101, 18))
        self.nfc_scan_label.setObjectName("nfc_scan_label")
        self.page_stacked_widget.addWidget(self.ring_page)
        self.after_call_page = QtWidgets.QWidget()
        self.after_call_page.setObjectName("after_call_page")
        self.call_end_message = QtWidgets.QLabel(parent=self.after_call_page)
        self.call_end_message.setGeometry(QtCore.QRect(30, 10, 411, 81))
        font = QtGui.QFont()
        font.setPointSize(16)
        self.call_end_message.setFont(font)
        self.call_end_message.setLayoutDirection(QtCore.Qt.LayoutDirection.LeftToRight)
        self.call_end_message.setAlignment(QtCore.Qt.AlignmentFlag.AlignCenter)
        self.call_end_message.setObjectName("call_end_message")
        self.countdown = QtWidgets.QLabel(parent=self.after_call_page)
        self.countdown.setGeometry(QtCore.QRect(130, 160, 211, 81))
        font = QtGui.QFont()
        font.setPointSize(22)
        self.countdown.setFont(font)
        self.countdown.setAlignment(QtCore.Qt.AlignmentFlag.AlignCenter)
        self.countdown.setObjectName("countdown")
        self.label = QtWidgets.QLabel(parent=self.after_call_page)
        self.label.setGeometry(QtCore.QRect(140, 120, 191, 20))
        self.label.setAlignment(QtCore.Qt.AlignmentFlag.AlignCenter)
        self.label.setObjectName("label")
        self.page_stacked_widget.addWidget(self.after_call_page)
        self.horizontalLayout.addWidget(self.page_stacked_widget)
        MainWindow.setCentralWidget(self.centralwidget)

        self.retranslateUi(MainWindow)
        self.page_stacked_widget.setCurrentIndex(2)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "MainWindow"))
        self.uid_label.setText(_translate("MainWindow", "<Replace with NFC-ID>"))
        self.greeting_label.setText(_translate("MainWindow", "Welcome User:"))
        self.call_user_btn.setText(_translate("MainWindow", "Call User"))
        self.label_2.setText(_translate("MainWindow", "Select User to Call"))
        self.video_label.setText(_translate("MainWindow", "Calling User"))
        self.nfc_scan_label.setText(_translate("MainWindow", "Scan your card"))
        self.call_end_message.setText(_translate("MainWindow", "Message"))
        self.countdown.setText(_translate("MainWindow", "Countdown"))
        self.label.setText(_translate("MainWindow", "Returning to homepage in"))


if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    MainWindow.show()
    sys.exit(app.exec())
