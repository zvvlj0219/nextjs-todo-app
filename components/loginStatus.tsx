import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import Button from './button'
import styles from '../styles/app.module.css'

const LoginStatus = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { pathname } = router

    const signInHandler = useCallback(() => {
        router.push('/auth/signin')
    }, [])

    const signOutHandler = useCallback(() => {
        signOut()
    }, [])

    if (pathname === '/auth/signin') {
        return <></>
    }

    return (
        <>
            {!session && (
                <>
                    {status === 'loading' ? (
                        <Button
                            className={`
                                ${styles.login_status}
                            `}
                        >
                            Loading...
                        </Button>
                    ) : (
                        <Button
                            className={`
                                ${styles.login_status}
                                ${styles.login_status_signin}
                            `}
                            onClick={signInHandler}
                        >
                            Sign in
                        </Button>
                    )}
                </>
            )}
            {session && (
                <Button
                    className={`
                        ${styles.login_status}
                        ${styles.login_status_signout}
                    `}
                    onClick={signOutHandler}
                >
                    Sign out
                </Button>
            )}
        </>
    )
}

export default LoginStatus
