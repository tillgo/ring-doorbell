import { AnyCaseReducers, PayloadAction } from '@/common/react-toolkit'
import { AppContextState } from '@/base/appContext.tsx'

export type RTCConnectionState = {
    rtcConnection: {
        me: string
        stream: MediaStream | undefined
        receivingCall: boolean
        caller: string
        callerSignal: string | undefined
        callAccepted: boolean
        idToCall: string
        callEnded: boolean
        name: string
    }
}

export const initialStateRTCConnection: RTCConnectionState = {
    rtcConnection: {
        me: '',
        stream: undefined,
        receivingCall: false,
        caller: '',
        //ToDo check do I really need that?
        callerSignal: undefined,
        callAccepted: false,
        idToCall: '',
        callEnded: false,
        name: '',
    },
}

export const rtcConnectionReducers: AnyCaseReducers<AppContextState> = {
    updateMeRTCConn: (state, action: PayloadAction<string>) => {
        const me = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                me: me,
            },
        }
    },
    updateStreamRTCConn: (state, action: PayloadAction<MediaStream | undefined>) => {
        const stream = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                stream: stream,
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
    updateCallerRTCConn: (state, action: PayloadAction<string>) => {
        const caller = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                caller: caller,
            },
        }
    },
    updateCallerSignalRTCConn: (state, action: PayloadAction<string | undefined>) => {
        const callerSignal = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                callerSignal: callerSignal,
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
    updateNameRTCConn: (state, action: PayloadAction<string>) => {
        const name = action.payload
        return {
            ...state,
            rtcConnection: {
                ...state.rtcConnection,
                name: name,
            },
        }
    },
}
