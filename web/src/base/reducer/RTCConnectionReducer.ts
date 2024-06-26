import { AnyCaseReducers, PayloadAction } from 'src/lib/react-toolkit'
import { AppContextState } from '@/base/appContext.tsx'

export type RTCConnectionState = {
    rtcConnection: {
        myStream: MediaStream | undefined
        oppositeStream: MediaStream
        receivingCall: boolean
        oppositeId: string
        callAccepted: boolean
        idToCall: string
        callEnded: boolean
    }
}

export const initialStateRTCConnection: RTCConnectionState = {
    rtcConnection: {
        myStream: undefined,
        oppositeStream: new MediaStream(),
        receivingCall: false,
        oppositeId: '',
        callAccepted: false,
        idToCall: '',
        callEnded: false,
    },
}

export const rtcConnectionReducers: AnyCaseReducers<AppContextState> = {
    updateMyStreamRTCConn: (state, action: PayloadAction<MediaStream | undefined>) => {
        const stream = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                myStream: stream,
            },
        }
    },
    updateOppositeStreamRTCConn: (state, action: PayloadAction<MediaStream>) => {
        const stream = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                oppositeStream: stream,
            },
        }
    },
    updateReceivingCallRTCConn: (state, action: PayloadAction<boolean>) => {
        const receivingCall = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                receivingCall: receivingCall,
            },
        }
    },
    updateOppositeIdRTCConn: (state, action: PayloadAction<string>) => {
        const caller = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                oppositeId: caller,
            },
        }
    },
    updateCallAcceptedRTCConn: (state, action: PayloadAction<boolean>) => {
        const callAccepted = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                callAccepted: callAccepted,
            },
        }
    },
    updateIdToCallRTCConn: (state, action: PayloadAction<string>) => {
        const idToCall = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                idToCall: idToCall,
            },
        }
    },
    updateCallEndedRTCConn: (state, action: PayloadAction<boolean>) => {
        const callEnded = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                callEnded: callEnded,
            },
        }
    },
}
