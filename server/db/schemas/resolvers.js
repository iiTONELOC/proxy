const { query } = require('../controller');
const { createNewUser, loginUser } = require('../controller/user/mutations');
const { user } = query;
const resolvers = {
    Query: {
        users: user.findAll,
        // location: location.findAll
    },
    Mutation: {
        addUser: createNewUser,
        login: loginUser,
    }
};
module.exports = resolvers;