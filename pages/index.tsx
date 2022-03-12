import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import { SessionProvider, LoginButton, useSession, LogoutButton } from '@inrupt/solid-ui-react'

function Blazon () {
  const [qrCode, setQrCode] = useState<string>();
  const [webid, setWebid] = useState<string>();
  const { session } = useSession();

  session.onLogin(() => {
    setWebid(session.info.webId);
  });

  useEffect(() => {
    if (webid !== undefined) {
      (async () => {
        try {
          setQrCode(await QRCode.toString(webid, {type: "svg"}))
        } catch (err) {
          console.error(err)
        }
      })()
    }
  }, [qrCode, webid]);

  if (session.info.isLoggedIn) {
    return <image>{ parse(qrCode ?? "") }</image>
  }
  return <LoginButton 
  oidcIssuer='https://login.inrupt.com'
  redirectUrl="http://localhost:3000">
  </LoginButton>
}

const Home: NextPage = () => {
  return (
    <SessionProvider>
      <div className={styles.container}>
        <Head>
          <title>Solid Blazon</title>
          <meta name="description" content="Generate your WebID QR code" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Solid-Blazon
          </h1>
          <Blazon />
  {/* 
  https://stackoverflow.com/questions/28226677/save-inline-svg-as-jpeg-png-svg
  https://css-tricks.com/using-svg/
  */}
          
        </main>
      </div>
    </SessionProvider>
  )
}

export default Home
