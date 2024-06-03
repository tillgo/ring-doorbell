import asyncio
from typing import Callable

import board
import busio
from digitalio import DigitalInOut

from adafruit_pn532.i2c import PN532_I2C


def wait_for_nfc_id():
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

        print("Found card with UID:", [hex(i) for i in uid])
        return uid
