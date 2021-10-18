import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { ApolloProvider } from '@apollo/client';
import client from '../utilities/apollo/client.config';
import { ChatProvider } from '../components/Providers/Chat';
import NavBar from '../components/navigation/NavBar';




function MyApp({ Component, pageProps }) {

  return (
    <ApolloProvider client={client}>
      <ChatProvider>
        <NavBar />
        <Component  {...pageProps} />
      </ChatProvider>
    </ApolloProvider>

  )

}

export default MyApp
