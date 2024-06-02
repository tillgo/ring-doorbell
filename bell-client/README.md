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
```pyuic6 -x ./ui-designer/yourfile.ui -o ./view/yourfile.py```


### Main Window Size
To fit the touch screen, max size has to be 480px x 250px

## Other Requirements:

### pyaudio

```Debian: sudo apt install portaudio19-dev```
```Fedora: sudo dnf install portaudio-devel redhat-rpm-config```
```pip install pyaudio```


## Raspberry PI

### Startup GUI
```startx```   
Important: no sudo, as that would open the gui as root user. In that case some things like bluetooth wont work correctly

### Start project
!!!must be executed directly on the pi. Not possible over ssh!!!
```
   cd ~/programms/ring-doorbell/bell-client/   
   source venv/bin/activate   
   python3 main.py
```

### Important Libraries to install (if not already done)
- pip3 install adafruit-circuitpython-pn532

### Python Virtual Environment
to use globally installed pyqt6 installation, include-system-site-packages = true is set in in ./venv/pyvenv.cfg





