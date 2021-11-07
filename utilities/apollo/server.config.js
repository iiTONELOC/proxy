
import {
    ApolloClient,
    InMemoryCache,
} from "@apollo/client";
import cache from "./cache";


const serverClient = new ApolloClient({ uri: 'https://proximo-chat.herokuapp.com:3000/graphql', cache: cache() });

export default serverClient;