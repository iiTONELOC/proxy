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
    profilePicture: String
    
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
    socket: ID
    incomingRequests: [User]
    pendingRequests: [User]
}
type Distance{
    distance: String
}

type Query {
    me: User
    users: [User]
    user(user:ID): User
    inRange: User
    friendRequests: User
    globalMessages: [Message]
    friends: User
    getDistance(
        lat1: String!
        lon1: String!
        lat2: String
        lon2: String
    ): Distance
}

type Mutation{
    addUser(
        username: String!,
        email: String!, 
        password: String!, 
        latitude: String, 
        longitude: String, 
        ): Auth
    login( email: String!, password: String! latitude: String,
        longitude: String, ): Auth
    logout:User
    addFriend(friendId: ID!): User
    acceptFriend(friendId: ID!): User
    rejectFriend(friendId: ID!): User
    removeFriend(friendId: ID!): User
    uploadProfilePicture(picture: String!): Profile
    editProfile(bio: String, visible: Boolean,): Profile
    editMessage(messageId: ID!, text: String ):Message
    deleteMessage(messageId: ID!): Message
}

type Auth {
    token: ID
    user: User
}
`

// export the typeDefs
module.exports = typeDefs