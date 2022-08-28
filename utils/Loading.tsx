import {
    useContext,
    createContext,
    useReducer,
    useMemo,
} from 'react'
import styles from '../styles/loading.module.css'

type State = {
    loading: boolean
}

const ActionType = {
    LOAD_START: 'LOAD_START',
    LOAD_FINISH: 'LOAD_FINISH',
} as const

type Action = {
    type: typeof ActionType[keyof typeof ActionType]
    payload: boolean
}

const loadingReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.LOAD_START:
            return {
                loading: true
            }
            break

        case ActionType.LOAD_FINISH:
            return {
                loading: false
            }
            break

        default:
            return state
    }
}

const initialState = (): State => {
    return {
        loading: true
    }
}

const LoadingContext = createContext(
    {} as {
        state: State
        startLoad: () => void
        finishLoad: () => void
    }
)

export const useLoading = () => {
    return useContext(LoadingContext)
}

export const LoadingContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(loadingReducer, initialState())

    const startLoad = () => {
        dispatch({
            type: ActionType.LOAD_START,
            payload: true
        })
    }

    const finishLoad = () => {
        dispatch({
            type: ActionType.LOAD_FINISH,
            payload: false
        })
    }

    const value = useMemo(
        () => ({
            state,
            startLoad,
            finishLoad
        }),
        [state, startLoad, finishLoad]
    )

    return (
        <LoadingContext.Provider value={value}>
            { children }
        </LoadingContext.Provider>
    )
}

export const LoadingIcon = ({ loading }: State) => {
    return (
        <div id='modal'>
            <div
                id='mask'
                className={`
                    ${styles.mask}
                    ${!loading && styles.hidden}
                `}
            >
                <div
                    id='iconWrapper'
                    className={styles.icon_wrapper}
                >
                    {/* icon core*/}
                    <div className={styles.spinner_box}>
                        <div>...loading</div>
                        <div className={styles.circle_border}>
                            <div className={styles.circle_core} />
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    )
}
