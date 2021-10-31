
const { query } = require('../controller');
const userMutations = require('../controller/user/mutations');
const { createNewUser, loginUser, userLogout, addFriend, acceptFriend } = userMutations;
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
        addFriend: addFriend,
        acceptFriend: acceptFriend
    }
};
module.exports = resolvers;