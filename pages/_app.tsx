import { SessionProvider } from 'next-auth/react'
import { TodoContextProvider } from '../utils/Store'
import { LoadingContextProvider } from '../utils/Loading'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
    return (
        <SessionProvider session={session}>
            <LoadingContextProvider>
                <TodoContextProvider>
                    <Component {...pageProps} />
                </TodoContextProvider>
            </LoadingContextProvider>
        </SessionProvider>
    )
}

export default App
