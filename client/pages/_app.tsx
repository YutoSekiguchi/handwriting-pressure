import '../styles/globals.css'
import '../styles/Slider.css'
import type { AppProps } from 'next/app'
import { UsersProvider } from '../hooks/contexts/usersContext'
// import "../styles/my-custom-class.css"

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <UsersProvider>
      <Component {...pageProps} />
    </UsersProvider>
  </>
}

export default MyApp
