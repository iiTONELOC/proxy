const { query } = require('../controller');
const { user, location } = query;
const resolvers = {
    Query: {
        users: user.findAll,
        // location: location.findAll
    },

};
module.exports = resolvers;