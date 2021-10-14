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
type Message{
    _id: ID
    channel: ID
    text: String
    time: String
    sender: String
}
type Channel{
    _id: ID
    name: String
    description: String
    private: Boolean
    ownerName: String
    location: Location
    messages: [Message]
    members: [User]
    active:[User]
    server:ID
}
type Server{
    _id: ID
    name: String
    description: String
    private: Boolean
    ownerName: String
    channels: [Channel]
}
type User {
    _id: ID
    username: String
    email: String
    location: Location
    profile: Profile
    status: OnlineStatus
    servers:[Server]
    friends:[User]
    friendCount: Int
    usersInRange: [User]
}


type Query {
    users: [User]
}

type Mutation{
     addUser(username: String!, email: String!, password: String!, latitude: String, longitude: String, city: String, state: String): Auth
}

type Auth {
    token: ID!
    user: User
}
`

// export the typeDefs
module.exports = typeDefs