import '../styles/globals.css';
import store from '../utilities/redux/store';
import { ApolloProvider } from '@apollo/client';
import { Provider as Redux } from 'react-redux';
import NavBar from '../components/navigation/NavBar';
import client from '../utilities/apollo/client.config';
import { ChatProvider } from '../components/Providers/Chat';

function MyApp({ Component, pageProps }) {

  return (
    <ApolloProvider client={client}>
      <Redux store={store}>
        <ChatProvider>
          <NavBar />
          <Component {...pageProps} />
        </ChatProvider>
      </Redux>
    </ApolloProvider>
  );
};

export default MyApp

