import { db } from '../index'
import { DeviceIdentifier } from '../shared/types'

export const getDeviceWithSecret = async (deviceIdentifier: DeviceIdentifier) => {
    return await db.query.device.findFirst({
        where: (device, {eq}) => eq(device.identifier, deviceIdentifier.identifier),
    }).execute()
}