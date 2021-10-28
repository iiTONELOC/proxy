import Head from 'next/head';
import { useEffect, useState } from 'react';
import Landing from '../components/Landing';
import ResponsiveLayout from '../components/responsive-layout/Responsive';
import auth from '../utilities/auth';
import { useRouter } from 'next/router';
export default function Home({ memory }) {
  const router = useRouter();
  const [userID, setUserID] = useState(null);
  useEffect(() => {
    const loggedIn = auth.getProfile();
    if (loggedIn) {
      setUserID(loggedIn.data._id);
    }
  }, []);

  if (userID) router.push(`/proxy-chat/${userID}`);


  return (
    <>
      <Head>
        <title>Welcome to Proxy Chat!</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!userID ? <ResponsiveLayout viewData={{ Landing: Landing, display: 'single' }} /> : null}
    </>
  );
};
