const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Location{
    _id: ID
    username: String
    latitude: String
    longitude: String
    city: String
    state: String
}
type User {
    _id: ID
    username: String
    email: String
    location: Location
}


type Query {
    users: [User]
    location:[Location]
}


type Auth {
    token: ID!
    user: User
}
`

// export the typeDefs
module.exports = typeDefs