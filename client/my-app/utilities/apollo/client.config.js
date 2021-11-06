import { setContext } from '@apollo/client/link/context';
import {
    ApolloClient,
    createHttpLink
} from "@apollo/client";
import cache from './cache';

let clientData;

if (typeof window !== undefined) {
    const httpLink = createHttpLink({
        uri: `/graphql`,
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
        cache: cache(),
    };
} else {
    clientData = {
        uri: `http://proximo-chat.herokuapp.com/graphql`,
        cache: cache(),
    };
};

const client = new ApolloClient(clientData);

export default client;