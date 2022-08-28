import React, { useState, useCallback, useRef } from 'react'
import Button from './button'
import { useTodo, ActionType } from '../utils/Store'
import type { Todo } from '../types/type'
import styles from '../styles/app.module.css'

const TodoForm = ({ _id, todo = '' }: Todo) => {
    const inputElement = useRef<HTMLInputElement>(null)
    const { dispatch } = useTodo()

    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isDelete, setIsDelte] = useState<boolean>(true)
    const [textField, setTextFeild] = useState<string>(todo)

    const onFocusHandler = useCallback(
        (cond: 'focus' | 'blur') => {
            if (cond === 'focus') {
                setIsEdit(true)
                setIsDelte(false)
            }

            if (cond === 'blur' && inputElement.current !== null) {
                setIsEdit(false)
                setIsDelte(true)
                // call editTodoHandler
                inputElement.current.blur()
            }
        },
        [setIsEdit, setIsDelte]
    )

    const onChangeHandler = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setTextFeild((event.target as HTMLInputElement).value)
        },
        [setTextFeild]
    )

    const onKeyPressHandler = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === 'Enter') {
            onFocusHandler('blur')
        }
    }

    const editTodoHandler = useCallback(
        async (new_todo: string) => {
            const baseurl = process.env.NEXT_PUBLIC_DEVELOPMENT_BASEURL as
                | RequestInfo
                | URL
            const res = await fetch(`${baseurl}/api/todos/todo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id,
                    todo: new_todo
                })
            })
            const { result } = await res.json()

            onFocusHandler('blur')

            if (new_todo === todo) return

            dispatch({
                type: ActionType.EDIT_TODO,
                payload: {
                    _id,
                    todo: result.todo
                }
            })
        },
        [_id, dispatch, onFocusHandler, todo]
    )

    const deleteTodoHandler = useCallback(async () => {
        const baseurl = process.env.NEXT_PUBLIC_DEVELOPMENT_BASEURL as
            | RequestInfo
            | URL
        await fetch(`${baseurl}/api/todos/todo`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id
            })
        })

        dispatch({
            type: ActionType.DELETE_TODO,
            payload: {
                _id
            }
        })
    }, [_id, dispatch])

    return (
        <>
            <input
                type='text'
                ref={inputElement}
                value={textField}
                className={styles.todo_input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onChangeHandler(e)
                }}
                onFocus={() => onFocusHandler('focus')}
                onBlur={() => {
                    editTodoHandler(textField)
                }}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    onKeyPressHandler(e)
                }}
            />
            <div className={styles.todo_button_wrapper}>
                <Button
                    className={`
                        ${isEdit && styles.edit_button_active}
                        ${styles.edit_button}
                    `}
                    // click to call editTodoHandler
                    onClick={() => onFocusHandler('blur')}
                >
                    edit
                </Button>
                <Button
                    className={`
                    ${isDelete && styles.delete_button_active}
                    ${styles.delete_button}
                    `}
                    onClick={() => deleteTodoHandler()}
                >
                    delete
                </Button>
            </div>
        </>
    )
}

export default TodoForm
