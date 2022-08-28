import { useCallback } from 'react'
import Layout from '../components/layout'
import Button from '../components/button'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import appImage from '../public/todo-app.png'
import styles from '../styles/app.module.css'

const Home = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const showTodos = useCallback(() => {
        if (session) {
            router.push('/todo')
        } else {
            router.push('/auth/signin')
        }
    }, [])

    return (
        <Layout title='home'>
            <div>
                <div className={styles.flex_container}>
                    <h2 className={styles.hero}>Create Your Todo</h2>
                    <div className={styles.hero_image}>
                        <Image src={appImage} />
                    </div>
                </div>
                <Button
                    onClick={() => showTodos()}
                    className={styles.show_todos}
                >
                    show my Todos
                </Button>
            </div>
        </Layout>
    )
}

export default Home
