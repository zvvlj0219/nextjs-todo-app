import { TodoContextProvider } from '../utils/Store'
import { LoadingContextProvider } from '../utils/Loading'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

function App({ Component, pageProps }: AppProps) {
    return (
        <LoadingContextProvider>
            <TodoContextProvider>
                <Component {...pageProps} />
            </TodoContextProvider>
        </LoadingContextProvider>
    )
}

export default App
