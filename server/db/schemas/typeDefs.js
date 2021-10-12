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
type OnlineStatus{
    _id: ID
    username: String
    online: Boolean
    status: String
}
type Profile{
    _id: ID
    username: String
    bio: String
    visible: Boolean
    location: ID
    ProfilePicture: String
    
}
type User {
    _id: ID
    username: String
    email: String
    location: Location
    profile: Profile
    status: OnlineStatus
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