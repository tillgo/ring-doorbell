# Bell Client



## Using QT-Designer

### Installing QT-Designer
#### Linux (Fedora)

1. ```sudo dnf install qt6-designer```  
(reboot might be necessary)
2. ```qt6-designer``` in cli or open with GUI


#### Windows
https://www.pythonguis.com/installation/install-qt-designer-standalone/

#### Create UI File
Ui Files should be saved in the ui directory under the root directory

#### Convert UI File to Python File
execute the following in the root directory 
```pyuic6 -x ./ui/yourfile.ui -o ./yourfile.py```


### Main Window Size
To fit the touch screen, max size has to be 480px x 250px

## Raspberry PI

### Startup GUI
```sudo startx```

### Start project
```cd ~/programms/ring-doorbell/bell-client/   
   source venv/bin/activate   
   python3 main.py
```



