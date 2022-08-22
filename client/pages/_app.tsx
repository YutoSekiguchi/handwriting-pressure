import '../styles/globals.css'
import '../styles/Slider.css'
import type { AppProps } from 'next/app'
import AppProvider from '../hooks/contexts/main'
// import "../styles/my-custom-class.css"

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  </>
}

export default MyApp
