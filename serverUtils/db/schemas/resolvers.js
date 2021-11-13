
const { query } = require('../controller');
const userMutations = require('../controller/user/mutations');
const { user, message } = query;
const {
    editBio,
    loginUser,
    addFriend,
    userLogout,
    acceptFriend,
    rejectFriend,
    createNewUser,
    editProfilePicture,
    removeSelectedFriend
} = userMutations;

const resolvers = {
    Query: {
        users: user.findAll,
        friends: user.findMe,
        inRange: user.findMe,
        user: user.serverFindMe,
        friendRequests: user.findMe,
        getDistance: user.getDistance,
        globalMessages: message.globalMessages,
        // location:   location.findAll
    },
    Mutation: {
        login: loginUser,
        logout: userLogout,
        addFriend: addFriend,
        addUser: createNewUser,
        acceptFriend: acceptFriend,
        rejectFriend: rejectFriend,
        removeFriend: removeSelectedFriend,
        uploadProfilePicture: editProfilePicture,
        editProfile: editBio
    }
};
module.exports = resolvers;