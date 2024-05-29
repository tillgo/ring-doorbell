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
        MainWindow.resize(480, 250)
        MainWindow.setMaximumSize(QtCore.QSize(480, 250))
        self.centralwidget = QtWidgets.QWidget(parent=MainWindow)
        self.centralwidget.setObjectName("centralwidget")
        self.main_frame = QtWidgets.QFrame(parent=self.centralwidget)
        self.main_frame.setGeometry(QtCore.QRect(0, 0, 480, 250))
        self.main_frame.setMaximumSize(QtCore.QSize(480, 250))
        self.main_frame.setFrameShape(QtWidgets.QFrame.Shape.StyledPanel)
        self.main_frame.setFrameShadow(QtWidgets.QFrame.Shadow.Raised)
        self.main_frame.setObjectName("main_frame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.main_frame)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.page_stacked_widget = QtWidgets.QStackedWidget(parent=self.main_frame)
        self.page_stacked_widget.setObjectName("page_stacked_widget")
        self.ring_page = QtWidgets.QWidget()
        self.ring_page.setObjectName("ring_page")
        self.uid_label = QtWidgets.QLabel(parent=self.ring_page)
        self.uid_label.setGeometry(QtCore.QRect(140, 90, 161, 18))
        self.uid_label.setObjectName("uid_label")
        self.greeting_label = QtWidgets.QLabel(parent=self.ring_page)
        self.greeting_label.setGeometry(QtCore.QRect(140, 60, 161, 18))
        self.greeting_label.setObjectName("greeting_label")
        self.call_user_btn = QtWidgets.QPushButton(parent=self.ring_page)
        self.call_user_btn.setGeometry(QtCore.QRect(190, 120, 87, 26))
        self.call_user_btn.setObjectName("call_user_btn")
        self.page_stacked_widget.addWidget(self.ring_page)
        self.call_page = QtWidgets.QWidget()
        self.call_page.setObjectName("call_page")
        self.label = QtWidgets.QLabel(parent=self.call_page)
        self.label.setGeometry(QtCore.QRect(190, 20, 81, 20))
        self.label.setObjectName("label")
        self.page_stacked_widget.addWidget(self.call_page)
        self.greeting_page = QtWidgets.QWidget()
        self.greeting_page.setObjectName("greeting_page")
        self.nfc_card_icon = QtWidgets.QLabel(parent=self.greeting_page)
        self.nfc_card_icon.setGeometry(QtCore.QRect(170, 40, 121, 101))
        self.nfc_card_icon.setText("")
        self.nfc_card_icon.setPixmap(QtGui.QPixmap(":/nfc-card/assets/nfc-card.png"))
        self.nfc_card_icon.setScaledContents(True)
        self.nfc_card_icon.setObjectName("nfc_card_icon")
        self.nfc_scan_label = QtWidgets.QLabel(parent=self.greeting_page)
        self.nfc_scan_label.setGeometry(QtCore.QRect(180, 130, 101, 18))
        self.nfc_scan_label.setObjectName("nfc_scan_label")
        self.pushButton = QtWidgets.QPushButton(parent=self.greeting_page)
        self.pushButton.setGeometry(QtCore.QRect(330, 200, 121, 26))
        self.pushButton.setObjectName("pushButton")
        self.page_stacked_widget.addWidget(self.greeting_page)
        self.horizontalLayout.addWidget(self.page_stacked_widget)
        MainWindow.setCentralWidget(self.centralwidget)

        self.retranslateUi(MainWindow)
        self.page_stacked_widget.setCurrentIndex(1)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "MainWindow"))
        self.uid_label.setText(_translate("MainWindow", "<Replace with NFC-ID>"))
        self.greeting_label.setText(_translate("MainWindow", "Welcome User:"))
        self.call_user_btn.setText(_translate("MainWindow", "Call User"))
        self.label.setText(_translate("MainWindow", "Calling User"))
        self.nfc_scan_label.setText(_translate("MainWindow", "Scan your card"))
        self.pushButton.setText(_translate("MainWindow", "I have no card"))


if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    MainWindow.show()
    sys.exit(app.exec())
