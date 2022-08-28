import { signIn, getProviders, getSession, getCsrfToken } from "next-auth/react";
import Layout from "components/layout";
import type { GetServerSidePropsContext} from 'next'

type Providers = {
    providers: {
        [key: string]: {
            id: string ,
            name: string ,
            type: string ,
            signinUrl: string ,
            callbackUrl: string 
        }
    }
} 
    
const signin = ({ providers }: Providers) => {
    const onClick = async (id: string) => {
        signIn(id)
    }
    return (
        <Layout title="login">
            <div style={{width: '30%', margin: '0 auto'}}>
                {Object.values(providers).map((provider) => {
                    return (
                    <div key={provider.name} style={{fontSize: '5rem'}}>
                        <button
                            onClick={() => onClick(provider.id)}
                            style={{
                                color: 'black',
                                padding: '2rem 4rem',
                                width: '300px',
                                margin: '4rem',
                                fontSize: '1.5rem',
                                display: 'block',
                            }}
                        >
                        Sign in with {provider.name}
                        </button>
                    </div>
                    );
                })}
            </div>
        </Layout>
    )
}




export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { req } = context
    const session = await getSession({ req });

    if (session) {
        return {
            redirect: { 
                destination: "/todo"
            },
        };
    }

    const providers = await getProviders()
    const csrfToken = await getCsrfToken()

    console.log('csrfToken')
    console.log(csrfToken)

    return {
        props: {
            providers,
            csrfToken
        }
    };
}

export default signin