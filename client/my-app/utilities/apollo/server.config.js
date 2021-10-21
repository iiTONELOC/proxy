
import {
    ApolloClient,
    InMemoryCache,
} from "@apollo/client";
import cache from "./cache";


const serverClient = new ApolloClient({ uri: 'http://localhost:3001/graphql', cache: cache() });

export default serverClient;