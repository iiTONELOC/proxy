const express = require('express');
const cors = require('cors');
const next = require('next');
const app = express();

const socketIo = require('socket.io');
const PORT = process.env.PORT || 3000;
const { Chat } = require('./lib/chat/index');
const DB = require('./lib/db/config/connection');
const dev = process.env.NODE_ENV !== 'production';

const { typeDefs, resolvers } = require('./lib/db/schemas');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./lib/utils/middleware/auth');


async function startServer() {
    DB.once('open', async () => {
        console.log('Connected to MongoDB\nStarting Servers Please Wait...');
        app.use(cors());
        await bootstrapNextApp(app);
        await bootstrapApolloServer(app);
        bootstrap_and_start_SystemsServer(app);
    });
};

async function bootstrapNextApp(expressApp) {
    const NextApp = next({ dev })
    await NextApp.prepare();
    expressApp.get('*', NextApp.getRequestHandler());
    console.log(`[Next.js Ready]`);
};

async function bootstrapApolloServer(expressApp) {
    const apolloServer = new ApolloServer({
        uri: 'http://localhost:3000/graphql',
        typeDefs,
        resolvers,
        context:
            authMiddleware,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: expressApp });
    console.log(`[Apollo Server Ready] Access GraphQL @ http://studio.apollographql.com/sandbox/explorer`);
};
function bootstrap_and_start_SystemsServer(expressApp) {
    const systemsServer = require('http').createServer(expressApp);
    const io = socketIo(systemsServer, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    });
    return systemsServer.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`[Server] ready on port ${PORT} Access @ http://localhost:3000`);
        Chat(io);
    });
};

startServer();


