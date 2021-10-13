const { query } = require('../controller');
const { createNewUser } = require('../controller/user/mutations');
const { user } = query;
const resolvers = {
    Query: {
        users: user.findAll,
        // location: location.findAll
    },
    Mutation: {
        addUser: createNewUser
    }
};
module.exports = resolvers;