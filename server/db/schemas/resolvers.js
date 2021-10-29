const { query } = require('../controller');
const { createNewUser, loginUser, userLogout, addNewFriend, acceptFriendRequest } = require('../controller/user/mutations');
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
        addFriend: addNewFriend,
        acceptFriend: acceptFriendRequest
    }
};
module.exports = resolvers;