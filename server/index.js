const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const socketIo = require('socket.io');
const db = require('./db/config/connection');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./db/schemas');
const { Chat } = require('./chat/index');

async function startApolloServer() {
    const apolloServer = new ApolloServer({
        uri: "http://localhost:3000/graphql",
        typeDefs,
        resolvers,
        context:
            authMiddleware,
    });
    const chatServer = require('http').createServer(app);
    const io = socketIo(chatServer, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    });
    await apolloServer.start();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    apolloServer.applyMiddleware({ app, });
    await new Promise(resolve => (chatServer.listen({ port: PORT }, Chat(io)), resolve));
}

db.once('open', () => {
    startApolloServer()
});