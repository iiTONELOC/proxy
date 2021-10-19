import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { ApolloProvider } from '@apollo/client';
import client from '../utilities/apollo/client.config';
import { ChatProvider } from '../components/Providers/Chat';
import NavBar from '../components/navigation/NavBar';
import { useEffect, useState } from 'react';




function MyApp({ Component, pageProps }) {
  const [memory, setMemory] = useState([]);
  useEffect(() => {
    const data = {
      timestamp: new Date().toLocaleTimeString(),
      trigger: Component
    };
    setMemory([...memory, data]);
  }, [Component]);
  return (
    <ApolloProvider client={client}>
      <ChatProvider>
        <NavBar />
        <Component memory={memory} {...pageProps} />
      </ChatProvider>
    </ApolloProvider>
  );
};

export default MyApp
