import { AnyCaseReducers, PayloadAction } from 'src/lib/react-toolkit'
import { AppContextState } from '@/base/appContext.tsx'

export type CallControllerState = {
    callController: {
        open: boolean
        isAnswerCall: boolean
    }
}

export const initialStateCallController: CallControllerState = {
    callController: {
        open: false,
        isAnswerCall: false,
    },
}

export const callControllerReducers: AnyCaseReducers<AppContextState> = {
    updateCallControllerOpen: (state, action: PayloadAction<boolean>) => {
        const open = action.payload
        return {
            ...state,
            callController: {
                ...state.callController,
                open: open,
            },
        }
    },
    updateIsAnswerCall: (state, action: PayloadAction<boolean>) => {
        const isAnswerCall = action.payload
        return {
            ...state,
            callController: {
                ...state.callController,
                isAnswerCall: isAnswerCall,
            },
        }
    },
}
