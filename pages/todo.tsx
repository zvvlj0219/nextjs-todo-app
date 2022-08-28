import { useEffect, useState, useCallback } from 'react'
import Layout from '../components/layout'
import Button from '../components/button'
import TodoForm from '../components/todo'
import db from '../utils/db'
import TodoSchema from '../models/Todo'
import { useTodo, ActionType } from '../utils/Store'
import { useLoading } from '../utils/Loading'
import styles from '../styles/app.module.css'
import type { Todo } from '../types/type'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'

type Props = {
    todoList: Todo[]
}

const Todo = ({ todoList }: Props) => {
    const {
        state: { loading },
        startLoad,
        finishLoad
    } = useLoading()

    const [isValid, setIsValid] = useState<boolean>(true)
    const [newTodo, setNewTodo] = useState<string>('')

    const { state, dispatch } = useTodo()

    const initTodo = useCallback(() => {
        startLoad()
        dispatch({
            type: ActionType.INIT_TODO,
            initialState: todoList
        })
        finishLoad()
    }, [startLoad, dispatch, finishLoad, todoList])

    const onChangeHandler = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setNewTodo((event.target as HTMLInputElement).value)
        },
        [setNewTodo]
    )

    const addTodoHandler = useCallback(
        async (_newTodo: string) => {
            if (_newTodo.length < 4) {
                setIsValid(false)
            } else {
                const baseurl = process.env.NEXT_PUBLIC_DEVELOPMENT_BASEURL as
                    | RequestInfo
                    | URL
                const res = await fetch(`${baseurl}/api/todos/todo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        todo: _newTodo
                    })
                })
                const { result } = await res.json()

                dispatch({
                    type: ActionType.ADD_TODO,
                    payload: {
                        _id: result._id,
                        todo: result.todo
                    }
                })
                setIsValid(true)
                setNewTodo('')
            }
        },
        [dispatch]
    )

    useEffect(() => {
        initTodo()
    }, [])

    return (
        <Layout title='todos'>
            <div className={styles.textfield_container}>
                <input
                    type='text'
                    placeholder='...'
                    className={styles.textfeild}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChangeHandler(e)
                    }}
                    value={newTodo}
                />
                <Button
                    className={styles.add_button}
                    onClick={() => addTodoHandler(newTodo)}
                >
                    add
                </Button>
                <div
                    className={`${isValid && styles.valid} ${
                        styles.validation_msg
                    }`}
                >
                    Enter at least 5 characters
                </div>
            </div>

            <div className={styles.todo_list_container}>
                {!loading &&
                    state.todoList &&
                    state.todoList.map((data) => (
                        <div className={styles.todo_container} key={data._id}>
                            <TodoForm _id={data._id} todo={data.todo} />
                        </div>
                    ))}
                {!loading && state.todoList.length === 0 && (
                    <>
                        <h3 style={{ textAlign: 'center' }}>
                            You have no Todos
                            <br />
                            Lets add new Todo!
                        </h3>
                    </>
                )}
            </div>
        </Layout>
    )
}

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const { req } = context
    const session = await getSession({ req })

    if (!session) {
        return {
            redirect: {
                destination: '/'
            }
        }
    }

    await db.connect()
    const todoList = await TodoSchema.find().lean()
    await db.disconnect()

    return {
        props: {
            todoList: todoList
                ? todoList.map((doc: Todo) => {
                      return db.convertDocToObj(doc)
                  })
                : []
        }
    }
}

export default Todo
