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
        Mutation: {
            fields: {
                addFriend: {
                    merge(existing, incoming) {
                        return incoming
                    }
                },
                acceptFriend: {
                    merge(existing, incoming) {
                        return incoming
                    }
                }
            }
        },
        User: {
            merge(existing, incoming) {
                return incoming
            },

            fields: {
                usersInRange: {
                    merge(existing, incoming) {
                        return incoming
                    }
                },
                incomingRequests: {
                    merge(existing, incoming) {
                        return incoming
                    }
                },
                pendingRequests: {
                    merge(existing, incoming) {
                        return incoming
                    }
                }


            }
        }


    }
});

export default cache