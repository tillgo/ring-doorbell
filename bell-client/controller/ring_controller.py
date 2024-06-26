from typing import Callable

import board
import busio
from adafruit_pn532.i2c import PN532_I2C
from digitalio import DigitalInOut


def wait_for_nfc_id(on_nfc_id_found_callback: Callable[[bytearray], None]):
    # NFC-Reader is connected to I2C
    i2c = busio.I2C(board.SCL, board.SDA)

    # Connect  RSTPD_N pin to digital Pin D6
    reset_pin = DigitalInOut(board.D6)

    # Connect  REQ pin to digital Pin D12 for hardware wakeup
    req_pin = DigitalInOut(board.D12)

    pn532 = PN532_I2C(i2c, debug=False, reset=reset_pin, req=req_pin)

    print("waiting for nfc chip")
    while True:
        # Check for NFC-Card
        uid = pn532.read_passive_target(timeout=2)
        print(".", end="")

        # if no NFC-Card was found continue waiting
        if uid is None:
            continue

        # else if NFC-Card was found call callback function
        on_nfc_id_found_callback(uid)
        print("Found card with UID:", [hex(i) for i in uid])
        return




