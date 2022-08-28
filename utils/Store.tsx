import {
    useContext,
    createContext,
    useReducer,
    useMemo,
    ReactNode
} from 'react'
import type { Dispatch } from 'react'
import type { Todo } from '../types/type'

type Props = {
    children: ReactNode
}

type State = {
    todoList: Todo[]
}

export const ActionType = {
    INIT_TODO: 'INIT_TODO',
    ADD_TODO: 'ADD_TODO',
    EDIT_TODO: 'EDIT_TODO',
    DELETE_TODO: 'DELETE_TODO'
} as const

type Action = {
    type: typeof ActionType[keyof typeof ActionType]
    payload?: Todo
    initialState?: Todo[]
}

const todoReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.INIT_TODO:
            if (action.initialState) {
                return {
                    todoList: [...action.initialState]
                }
            }

        case ActionType.ADD_TODO: {
            if (typeof action.payload === 'undefined') return state

            return {
                todoList: [
                    ...state.todoList,
                    {
                        _id: '',
                        todo: action.payload.todo
                    }
                ]
            }
        }
        case ActionType.EDIT_TODO: {
            if (typeof action.payload === 'undefined') return state

            const updatedTodoList = state.todoList.map((todoObj: Todo) => {
                if (todoObj._id !== action.payload?._id) return todoObj
                return {
                    ...(action.payload as Todo)
                }
            })

            return {
                todoList: updatedTodoList
            }
        }
        case ActionType.DELETE_TODO: {
            if (typeof action.payload === 'undefined') return state

            const deletedTodoList = state.todoList.filter((todoObj: Todo) => {
                return todoObj._id !== (action.payload as Todo)._id
            })

            return {
                todoList: deletedTodoList
            }
        }
    }
}

const initialStateFactory = (initialState?: State): State => {
    return {
        todoList: [],
        ...initialState
    }
}

const TodoContext = createContext(
    {} as {
        state: State
        dispatch: Dispatch<Action>
    }
)

export const useTodo = () => useContext(TodoContext)

export const TodoContextProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(todoReducer, initialStateFactory())

    const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

    return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}
