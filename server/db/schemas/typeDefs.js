const { gql } = require('apollo-server-express');

const typeDefs = gql`

type User {
    _id: ID
    username: String
    email: String
    
}


type Query {
    users: [User]
}


type Auth {
    token: ID!
    user: User
}
`

// export the typeDefs
module.exports = typeDefs