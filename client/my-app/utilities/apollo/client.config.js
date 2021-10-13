import { setContext } from '@apollo/client/link/context';
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink
} from "@apollo/client";

let clientData;
const cache = new InMemoryCache();

if (typeof window !== undefined) {
    const httpLink = createHttpLink({
        uri: `http://localhost:3001/graphql`,
    });
    const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('proxy_id_token');
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            },
        };
    });
    clientData = {
        link: authLink.concat(httpLink),
        cache: cache,
    };
} else {
    clientData = {
        uri: `http://${window.location.hostname}:3001/graphql`,
        cache: cache,
    };
};

const client = new ApolloClient({ ...clientData });

export default client;