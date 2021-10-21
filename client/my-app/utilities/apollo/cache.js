import {

    InMemoryCache,

} from "@apollo/client";

const cache = () => new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                users: {
                    merge(existing, incoming) {
                        return incoming
                    }
                }
            }
        },


    }
});

export default cache