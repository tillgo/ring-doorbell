import { createReducerContext } from '@/common/react-toolkit'
import {
    callControllerReducers,
    CallControllerState,
    initialStateCallController,
} from '@/base/reducer/CallControllerState.ts'

type AppContextState = CallControllerState

const initialState: AppContextState = {
    ...initialStateCallController,
}

const appContext = createReducerContext({
    initialState: initialState,
    reducers: {
        ...callControllerReducers,
    },
})
export const {
    ContextProvider: AppContextProvider,
    useActionDispatch: useAppDispatch,
    useValue: useAppValue,
    useSelector: useAppSelector,
} = appContext
