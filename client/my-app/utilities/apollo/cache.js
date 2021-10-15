import {

    InMemoryCache,

} from "@apollo/client";
const cache = new InMemoryCache({
    typePolicies: {
        User: {
            merge(existing, incoming) {
                return incoming
            }
        }
    }
});

export default cache