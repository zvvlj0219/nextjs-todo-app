import { useSession, signOut, getSession } from "next-auth/react"
import { GetServerSidePropsContext } from "next"

const Account = () => {
    const { data: session, status } = useSession()

    if (status === 'authenticated') {
        return (
            <div>
                <h1>welcome {session.user?.name}</h1>
            </div>
        )
    } else {
        return (
            <div>
                <h3>You are not signed in</h3>
            </div>
        )
    }

}

export default Account

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/login'
            }
        }
    }

    return {
        props: {
            session
        }
    }

}