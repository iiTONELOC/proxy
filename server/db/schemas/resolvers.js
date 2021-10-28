const { query } = require('../controller');
const { createNewUser, loginUser, userLogout, addNewFriend } = require('../controller/user/mutations');
const { user, message } = query;
const resolvers = {
    Query: {
        users: user.findAll,
        user: user.serverUser,
        inRange: user.inRange,
        globalMessages: message.globalMessages
        // location: location.findAll
    },
    Mutation: {
        addUser: createNewUser,
        login: loginUser,
        logout: userLogout,
        addFriend: addNewFriend
    }
};
module.exports = resolvers;