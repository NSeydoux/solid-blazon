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

function Blazon (props: {webid: string | undefined}) {
  const [qrCode, setQrCode] = useState<string>();

  useEffect(() => {
    if (props.webid !== undefined) {
      (async () => {
        try {
          setQrCode(await QRCode.toString(props.webid as string, {type: "svg"}))
        } catch (err) {
          console.error(err)
        }
      })()
    } else {
      setQrCode(undefined);
    }
  }, [qrCode, props.webid]);

  return <div className='container mx-auto max-w-xl'>
      <image>
        { qrCode ? parse(qrCode) : undefined }
      </image>
    </div>
}

function LogButton (props: {isLoggedIn: boolean}) {

  const [pageUrl, setPageUrl] = useState<string>();
  
  useEffect(() => {
    if (typeof window !== undefined) {
      setPageUrl(window.location.href);
    }
  })

  if (!props.isLoggedIn) {
    return <LoginButton 
    oidcIssuer='https://login.inrupt.com'
    redirectUrl={pageUrl ?? "http://localhost:4000"}>
    </LoginButton>
  }
  return <LogoutButton></LogoutButton>

}

const Home: NextPage = () => {
  const { session } = useSession();
  const [isLoggedIn, setIsLoggedin] = useState<boolean>(false);
  const [webid, setWebid] = useState<string>();

  session.onLogin(() => {
    setIsLoggedin(true);
    setWebid(session.info.webId);
  });

  session.onLogout(() => {
    setIsLoggedin(false);
    setWebid(undefined);
  });
  
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
            <LogButton {...{isLoggedIn}} />
          </button>
        </header>
        <Blazon {...{webid}}/>
    </SessionProvider>
  )
}

export default Home
