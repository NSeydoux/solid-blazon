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
import clientIdDocument from "./api/clientId.json";

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

  return <div className='mx-auto'>
    <p className='text-center hover:underline'><a href={props.webid}>{props.webid}</a></p>
    <div className='container mx-auto max-w-xl'>
      <image>
        { qrCode ? parse(qrCode) : undefined }
      </image>
    </div>
  </div>

}

function LogButton (props: {isLoggedIn: boolean}) {

  const [pageUrl, setPageUrl] = useState<string>();
  const [clientId, setClientId] = useState<string>();

  useEffect(() => {
    if (typeof window !== undefined) {
      setPageUrl(window.location.href);
      if (!window.location.href.includes("localhost")){
        setClientId(clientIdDocument.client_id);
      }
    }
  })

  if (!props.isLoggedIn) {
    return <LoginButton 
    oidcIssuer='https://login.inrupt.com'
    redirectUrl={pageUrl ?? "http://localhost:4000"}
    authOptions={{clientId, clientName: clientIdDocument.client_name}}>
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
          <link rel="icon" href="/solid-blazon-ico.svg" />
        </Head>
        <header className='flex flex-row items-center'>
          <img className='w-0 xs:w-20 invisible xs:visible m-1 ' src="/solid-blazon.svg" alt="Solid-Blazon logo"></img>
          <h1 className='w-0 xs:w-auto invisible xs:visible xs:mx-auto font-bold text-lg'>Solid-Blazon</h1>
          <button className='mx-auto xs:mx-1 w-20 border-2 rounded-md border-black'>
              <LogButton {...{isLoggedIn}} />
            </button>
        </header>
        <Blazon {...{webid}}/>
    </SessionProvider>
  )
}

export default Home
