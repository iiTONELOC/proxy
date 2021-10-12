const { userQueries } = require('../controller/user/queries');
const { locationQueries } = require('../controller/location/queries');
const User = userQueries;
const Location = locationQueries

const resolvers = {
    Query: {
        users: User.findAll,
        location: Location.findAll,
    },

};
module.exports = resolvers;