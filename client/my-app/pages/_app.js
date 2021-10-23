import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
// import { useEffect, useState } from 'react';
import store from '../utilities/redux/store';
import { ApolloProvider } from '@apollo/client';
import { Provider as Redux } from 'react-redux';
import NavBar from '../components/navigation/NavBar';
import client from '../utilities/apollo/client.config';
import { ChatProvider } from '../components/Providers/Chat';






function MyApp({ Component, pageProps }) {
  // const [memory, setMemory] = useState([]);
  // useEffect(() => {
  //   const data = {
  //     timestamp: new Date().toLocaleTimeString(),
  //     trigger: Component
  //   };
  //   setMemory([...memory, data]);
  // }, [Component]);
  return (
    <ApolloProvider client={client}>
      <Redux store={store}>
        <ChatProvider>
          <NavBar />
          <Component /*memory={memory}*/ {...pageProps} />
        </ChatProvider>
      </Redux>
    </ApolloProvider>
  );
};

export default MyApp
