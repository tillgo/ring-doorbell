import { AnyCaseReducers, PayloadAction } from '@/common/react-toolkit'

export type CallControllerState = {
    callControllerOpen: boolean
}

export const initialStateCallController: CallControllerState = {
    callControllerOpen: false,
}

export const callControllerReducers: AnyCaseReducers<CallControllerState> = {
    updateCallControllerOpen: (state, action: PayloadAction<boolean>) => {
        console.log('Bassd')
        const open = action.payload
        return { ...state, callControllerOpen: open }
    },
}
