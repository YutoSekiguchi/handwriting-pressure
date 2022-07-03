import '../styles/globals.css'
import '../styles/Slider.css'
import type { AppProps } from 'next/app'
// import "../styles/my-custom-class.css"

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Component {...pageProps} />
  </>
}

export default MyApp
