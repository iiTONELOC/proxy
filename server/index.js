const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const socketIo = require('socket.io');
const cors = require('cors');
const db = require('./db/config/connection');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./db/schemas');
const { Chat } = require('./chat/index');

// create the ApolloServer
const server = new ApolloServer({
    uri: "http://localhost:3000/graphql",
    typeDefs,
    resolvers,
    // add our auth middleware
    context:
        authMiddleware,
    // add the ip middleware
});
const chatServer = require('http').createServer(app);
const io = socketIo(chatServer, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
})

server.applyMiddleware({ app });
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.json({ limit: '50mb' }));
app.use(cors());

db.once('open', () => {
    chatServer.listen(PORT, () => {
        if (process.env.NODE_ENV === 'production') {
        } else {
            console.log(`API server running on port ${PORT}!`)
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
        }
        Chat(io)
    });
});
