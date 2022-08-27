import '../styles/globals.css'
import '../styles/Slider.css'
import type { AppProps } from 'next/app'
import AppProvider from '../hooks/contexts/main'
import lscache from 'lscache';
import { useEffect } from 'react';

function MyApp({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    if (router.pathname.includes('auth')||router.pathname==='/'||router.pathname==='/detail') return;
    // 期限切れのデータを削除
    lscache.flushExpired();
    // loginIdを取得できない場合
    if (!lscache.get('loginUserData')) {
      alert('タイムアウトが発生しました。ログインし直してください');
      window.location.href='/';
    }

  }, [Component]);

  return <>
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  </>
}

export default MyApp
