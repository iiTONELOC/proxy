
import {
    ApolloClient,
    InMemoryCache,
} from "@apollo/client";
import cache from "./cache";
import PORT from "../../server";

const serverClient = new ApolloClient({ uri: `http://localhost:${PORT}/graphql`, cache: cache() });

export default serverClient;