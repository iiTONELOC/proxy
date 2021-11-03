
const { query } = require('../controller');
const userMutations = require('../controller/user/mutations');
const { createNewUser, loginUser, userLogout, addFriend, acceptFriend, } = userMutations;
const { user, message } = query;
const resolvers = {
    Query: {
        users: user.findAll,
        user: user.serverFindMe,
        inRange: user.findMe,
        globalMessages: message.globalMessages,
        friends: user.findMe,
        getDistance: user.getDistance,
        // location:   location.findAll
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