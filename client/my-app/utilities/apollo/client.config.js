import { setContext } from '@apollo/client/link/context';
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink
} from "@apollo/client";
let clientData;
let link = undefined;

const cache = new InMemoryCache();
if (typeof window !== undefined) {
    const httpLink = createHttpLink({
        uri: '/graphql',
    });
    const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('id_token');
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            },
        };
    });
    link = authLink.concat(httpLink);
    clientData = {
        link: link,
        cache: cache,
    }

} else {
    clientData = {
        uri: `http://${window.location.hostname}/graphql`,
        cache: cache,
    }
}

const client = new ApolloClient({ ...clientData });

export default client;