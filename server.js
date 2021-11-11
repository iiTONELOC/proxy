const express = require('express');
const cors = require('cors');
const next = require('next');
const app = express();

const socketIo = require('socket.io');
const PORT = process.env.PORT || 3000;

const { Chat } = require('./serverUtils/chat/index');
const DB = require('./serverUtils/db/config/connection');
const dev = process.env.NODE_ENV !== 'production';

const { typeDefs, resolvers } = require('./serverUtils/db/schemas');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./serverUtils/utils/middleware/auth');

async function nextExpress(expressApp) {
    const NextApp = next({ dev })
    await NextApp.prepare();
    expressApp.get('*', NextApp.getRequestHandler())
    console.log('\x1b[32m[Next.js Ready]\x1b[0m');
};

async function nextApolloLaunch(expressApp) {
    const apolloServer = new ApolloServer({
        uri: `http://localhost:${PORT}/graphql`,
        typeDefs,
        resolvers,
        context:
            authMiddleware,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: expressApp, });
    console.log('\x1b[32m[Apollo Server Is Ready] \x1b[0m');
    console.log('\x1b[34mAccess GraphQL @ \x1b[4mhttp://studio.apollographql.com/sandbox/explorer\x1b[0m');
};
function startChat(expressApp) {
    const systemsServer = require('http').createServer(expressApp);
    const io = socketIo(systemsServer, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    });
    return systemsServer.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`\x1b[32m[Server] ready on port ${PORT}\n\x1b[34mAccess @ \x1b[4mhttp://localhost:${PORT}\x1b[0m`);
        Chat(io);
    });
};

async function main() {
    DB.once('open', async () => {
        console.log('Connected to MongoDB\nStarting Servers Please Wait...');
        app.use(cors());
        app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
        app.use(express.json({ limit: '50mb' }));
        await nextExpress(app);
        await nextApolloLaunch(app);
        startChat(app);
    });
};

main();