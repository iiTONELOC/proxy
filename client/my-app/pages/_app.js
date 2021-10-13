import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client';
import client from '../utilities/apollo/client.config';
import { ChatProvider } from '../components/Providers/Chat';




function MyApp({ Component, pageProps }) {

  return (
    <ApolloProvider client={client}>
      <ChatProvider>
        <Component {...pageProps} />
      </ChatProvider>
    </ApolloProvider>

  )

}

export default MyApp
