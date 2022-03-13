import type { NextPage } from 'next'
import Head from 'next/head'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import { 
  SessionProvider,
  LoginButton,
  useSession,
  LogoutButton
} from '@inrupt/solid-ui-react'

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

  return <div className='container mx-auto max-w-xl'>
      <image>
        { session.info.isLoggedIn ? parse(qrCode ?? "") : undefined }
      </image>
    </div>
}

function LogButton () {
  const { session } = useSession();
  const [isLoggedIn, setIsLoggedin] = useState<boolean>(false);
  const [pageUrl, setPageUrl] = useState<string>();
  
  useEffect(() => {
    if (typeof window !== undefined) {
      setPageUrl(window.location.href);
    }
  })

  session.onLogin(() => {
    setIsLoggedin(true);
  });

  session.onLogout(() => {
    setIsLoggedin(false);
  });

  if (!isLoggedIn) {
    return <LoginButton 
    oidcIssuer='https://login.inrupt.com'
    redirectUrl={pageUrl ?? "http://localhost:4000"}>
    </LoginButton>
  }
  return <LogoutButton></LogoutButton>

}

const Home: NextPage = () => {
  
  return (
    <SessionProvider>
        <Head>
          <title>Solid Blazon</title>
          <meta name="description" content="Generate your WebID QR code" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className='grid grid-cols-2 md:grid-cols-6'>
          <h1 className="md:col-start-2 p-4">
            Solid-Blazon
          </h1>
          <button className='md:col-end-6 p-4'>
            <LogButton />
          </button>
        </header>
        <Blazon />
    </SessionProvider>
  )
}

export default Home
