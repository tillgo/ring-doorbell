import { AnyCaseReducers, PayloadAction } from '@/common/react-toolkit'
import { AppContextState } from '@/base/appContext.tsx'

export type CallControllerState = {
    callController: {
        open: boolean
    }
}

export const initialStateCallController: CallControllerState = {
    callController: {
        open: false,
    },
}

export const callControllerReducers: AnyCaseReducers<AppContextState> = {
    updateCallControllerOpen: (state, action: PayloadAction<boolean>) => {
        console.log('Bassd')
        const open = action.payload
        return {
            ...state,
            callController: {
                ...state.callController,
                open: open,
            },
        }
    },
}
