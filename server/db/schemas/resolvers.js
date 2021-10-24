const { query } = require('../controller');
const { createNewUser, loginUser, userLogout } = require('../controller/user/mutations');
const { user } = query;
const resolvers = {
    Query: {
        users: user.findAll,
        user: user.serverUser,
        inRange: user.inRange,
        // location: location.findAll
    },
    Mutation: {
        addUser: createNewUser,
        login: loginUser,
        logout: userLogout
    }
};
module.exports = resolvers;