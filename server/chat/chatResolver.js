const { actions, reactions } = require("./actions");
const { _socket_user_login } = actions;
const { _authenticated } = reactions;
const sharedMutations = require('../db/controller/shared/sharedMutations');
const { updateUserSocket } = sharedMutations
let globalChatArray = [];


function alreadyJoined(array, socket) {
    const alreadyJoined = array.filter(user => (user.user.username === socket.USER.username));
    if (alreadyJoined.length > 0) {
        return true
    } else {
        return false
    }
}

const login = async ({ request, data }, socket, io) => {
    // eventually want to include an auth middleware on the socket
    if (request == _socket_user_login) {
        const { id } = data
        try {
            const socketData = socket.id
            // update our User's Socket
            // we also need to tell our friends we are now online - this updates their Friends Lists only
            const isUser = await updateUserSocket(id, socketData);
            if (isUser !== null) {
                socket.USER = {
                    _id: isUser._id,
                    username: isUser.username,
                    socket: isUser.socket,
                }
                socket.CURRENT = 'landing';
                // send to the user that they are authenticated with updated userInfo
                // this will prompt the client to save the userData and socket information in REDUX
                // grab our inRange
                return io.to(socket.id).emit(_authenticated, isUser)
            } else {
                return null
            }
        } catch (error) {
            console.log("login chatResolver", error)
            return null
        }
    }
};

const joinGlobal = async (usersInRange, socket, io) => {
    // grab user id, add user to the global chat's active array
    const inChat = alreadyJoined(globalChatArray, socket)
    if (inChat === false) {
        const user = { ...socket.USER }
        globalChatArray.push({ user: user });
        io.to('GlobalChat').emit('updateUsersInRange');
        socket.join('GlobalChat');

        // create a reuseable mutation to add a user to a chat's `active` array
    } else {
        console.log(`WHY`, socket.USER)
        io.to('GlobalChat').emit('updateUsersInRange');
    }
    // they need to update their users in range
    // we need to add this field to REDUX as it is currently all one field
    // we need to adjust the current redux operation to load the user data presented into the separate objects
}
const handleGlobalDisconnect = (socket, io) => {
    if (socket.USER !== undefined && socket.USER.username !== undefined) {
        const inChat = alreadyJoined(globalChatArray, socket);
        // filter current user out of the array
        if (inChat === true && globalChatArray.length > 0) {
            globalChatArray = globalChatArray.filter(el => el.user.username.toString() !== socket.USER.username.toString());
            return io.to(`GlobalChat`).emit('updateUsersInRange')
        }
    }

}
module.exports = { login, joinGlobal, handleGlobalDisconnect }