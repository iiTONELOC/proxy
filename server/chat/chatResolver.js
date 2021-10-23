const { actions, reactions } = require("./actions");
const { _socket_user_login } = actions;
const { _authenticated } = reactions;
const sharedMutations = require('../db/controller/shared/sharedMutations');
const { updateUserSocket } = sharedMutations
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
                // send to the user that they are authenticated with updated userInfo
                // this will prompt the client to save the userData and socket information in REDUX
                return io.to(socket.id).emit(_authenticated, isUser)
            } else {
                return null
            }
        } catch (error) {
            console.log("login chatResolver", error)
            return null
        }
    }

}

module.exports = { login }