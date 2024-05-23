import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/lib/components/ui/dialog.tsx'

import { Button } from '@/lib/components/ui/custom-button.tsx'
import { Phone, PhoneMissed } from 'lucide-react'

import { useAppDispatch } from '@/base/appContext.tsx'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '@/common/provider/SocketProvider.tsx'

export const ReceiveCallDialog = () => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const socket = useContext(SocketContext)
    const dispatch = useAppDispatch()

    useEffect(() => {
        socket?.on('callClient', (data) => {
            dispatch({ type: 'updateReceivingCallRTCConn', payload: true })
            dispatch({ type: 'updateOppositeIdRTCConn', payload: data.from })
            dispatch({ type: 'updateNameRTCConn', payload: data.name })
            dispatch({ type: 'updateCallerSignalRTCConn', payload: data.signal })
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
        // ToDo implement deny logic
        setDialogOpen(false)
    }

    return (
        <Dialog open={dialogOpen}>
            <DialogContent className="w-11/12 rounded-xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>... is calling</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full flex-wrap justify-between gap-2">
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
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
