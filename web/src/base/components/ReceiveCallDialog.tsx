import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/lib/components/ui/dialog.tsx'

import { Button } from '@/lib/components/ui/custom-button.tsx'
import { Phone, PhoneMissed } from 'lucide-react'

import { useAppDispatch, useAppSelector } from '@/base/appContext.tsx'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '@/common/provider/SocketProvider.tsx'

export const ReceiveCallDialog = () => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [callerName, setCallerName] = useState<string>('Unknown')
    const socket = useContext(SocketContext)
    const dispatch = useAppDispatch()
    const rtcData = useAppSelector((s) => s.rtcConnection)

    useEffect(() => {
        socket?.on('callClient', (data) => {
            dispatch({ type: 'updateReceivingCallRTCConn', payload: true })
            dispatch({ type: 'updateOppositeIdRTCConn', payload: data.from })
            dispatch({ type: 'updateCallerSignalRTCConn', payload: data.signal })
            setCallerName(data.name)
            setDialogOpen(true)
        })
    }, [dispatch, socket])

    const handleAcceptCall = () => {
        dispatch({ type: 'updateCallAcceptedRTCConn', payload: true })
        dispatch({ type: 'updateCallControllerOpen', payload: true })
        dispatch({ type: 'updateIsAnswerCall', payload: true })
        setDialogOpen(false)
    }

    const handleDenyCall = () => {
        setDialogOpen(false)
        socket?.emit('denyCall', { to: rtcData.oppositeId })
    }

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            //ToDo implement deny logic
        }
        setDialogOpen(isOpen)
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="w-11/12 rounded-xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{callerName ?? 'Unknown'} is calling</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Button
                        onClick={handleAcceptCall}
                        className="text-xl"
                        variant={'success'}
                        size={'lg'}
                    >
                        <Phone className="mr-4 h-6 w-6" />
                        Accept
                    </Button>
                    <Button
                        onClick={handleDenyCall}
                        className="text-xl"
                        variant={'destructive'}
                        size={'lg'}
                    >
                        <PhoneMissed className="mr-4 h-6 w-6" />
                        Deny
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
