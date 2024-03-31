import { createReducerContext } from '@/common/react-toolkit'
import {
    callControllerReducers,
    CallControllerState,
    initialStateCallController,
} from '@/base/reducer/CallControllerReducer.ts'
import {
    initialStateRTCConnection,
    rtcConnectionReducers,
    RTCConnectionState,
} from '@/base/reducer/RTCConnectionReducer.ts'

export type AppContextState = CallControllerState & RTCConnectionState

const initialState: AppContextState = {
    ...initialStateCallController,
    ...initialStateRTCConnection,
}

const appContext = createReducerContext({
    initialState: initialState,
    reducers: {
        ...callControllerReducers,
        ...rtcConnectionReducers,
    },
})
export const {
    ContextProvider: AppContextProvider,
    useActionDispatch: useAppDispatch,
    useValue: useAppValue,
    useSelector: useAppSelector,
} = appContext
