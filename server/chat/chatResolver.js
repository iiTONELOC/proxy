const { actions, reactions } = require("./actions");
const { _socket_user_login } = actions;
const { _authenticated } = reactions;
const sharedMutations = require('../db/controller/shared/sharedMutations');
const sharedQueries = require('../db/controller/shared/sharedQueries')
const { createMessage } = require("../db/controller/messages/mutations");
const { updateUserSocket } = sharedMutations;
let globalChatArray = [];


function alreadyJoined(array, socket) {
    const alreadyJoined = array.filter(user => (user === socket.USER.username));
    if (alreadyJoined.length > 0) {
        return true;
    } else {
        return false;
    };
};
function filterUserFromArray(socket) {
    globalChatArray = globalChatArray.filter(el => el.username !== socket.USER.username);
};
function sendMessage({ message, chat }, socket, io) {
    if (!socket) {
        return io.to(chat).emit('incomingChatMessage', message);
    };
};
const login = async ({ request, data }, socket, io) => {
    console.log(`USER IS TRYING TO LOG IN`, { request, data })
    // eventually want to include an auth middleware on the socket
    if (request == _socket_user_login) {
        const { id } = data;
        try {
            console.log(`CHAT SERVER- socket logging in:\n`)
            const socketData = socket.id;
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

                console.log(`CHAT SERVER- emit to client they are logged in line 48\n`)
                return io.to(socket.id).emit(_authenticated, isUser);
            } else {
                return null;
            }
        } catch (error) {
            console.log("login chatResolver", error);
            return null;
        };
    };
};

const joinGlobal = async (usersInRange, socket, io) => {
    // grab user id, add user to the global chat's active array

    const user = { ...socket.USER };
    console.log(`CHAT SERVER- joining global,`, user)
    if (globalChatArray.length > 0 && socket.USER) {
        const inChat = alreadyJoined(globalChatArray, socket);

        if (inChat === false && socket.CURRENT !== 'Global') {
            console.log(`CHAT SERVER- joining global\n`)
            globalChatArray.push({ user: user });
            socket.CURRENT = 'Global';
            // emit to our users inRange instead
            usersInRange?.forEach(user => io.to(user.socket).emit('updateUsersInRange'))
            socket.join('GlobalChat');
        } else {
            console.log(`CHAT SERVER- joining global, RECONNECTION\n`)
            // we need to update our users socket o
            const socketData = socket.id;
            // update our User's Socket
            // we also need to tell our friends we are now online - this updates their Friends Lists only
            const isUser = await updateUserSocket(socket.USER._id, socketData);
            const updatedUserData = {
                _id: isUser._id,
                username: isUser.username,
                socket: isUser.socket,
            }
            socket.USER = updatedUserData;
            // console.log(`WHY`, socket.USER);
            filterUserFromArray(socket);
            globalChatArray.push({ user: updatedUserData });
            usersInRange?.forEach(user => io.to(user.socket).emit('updateUsersInRange'))
            socket.join('GlobalChat');
            socket.CURRENT = 'Global';
        };
    } else {
        globalChatArray.push(user);
        socket.CURRENT = 'Global';
        // emit to our users inRange instead
        usersInRange?.forEach(user => io.to(user.socket).emit('updateUsersInRange'))
        socket.join('GlobalChat');
    }

};
const handleGlobalDisconnect = async (socket, io,) => {
    if (socket.USER !== undefined && socket.USER.username !== undefined) {
        const inChat = alreadyJoined(globalChatArray, socket);
        const uData = await sharedQueries.findUserByID(socket.USER._id);
        const online = uData?.status?.online;
        // if we are in the GlobalChat, we are set to offline status and there are members in the chat
        // and the users socket is currently set to globalChat we can go ahead and alert everyone in the 
        // chat to update their users in range
        if (inChat === true && online === false && globalChatArray.length > 0 && socket.CURRENT === 'Global') {
            filterUserFromArray(socket);
            return io.to(`GlobalChat`).emit('updateUsersInRange')
        } else {
            // io.to(`GlobalChat`).emit('updateUsersInRange')
            //    do nothing, this is prob due to a user refreshing or a socket disconnect but
            // not from a user tying to log out of the app
        };
    };
};
const handleGlobalMessage = async (message, socket, io) => {
    const user = { ...socket.USER };
    // create the message before sending; it successful then we will send 
    try {
        const createdMessage = await createMessage(null, message, user);
        const payload = {
            message: createdMessage,
            chat: 'GlobalChat'
        };
        if (createdMessage) sendMessage(payload, null, io);
    } catch (error) {
        console.error("Chat server- handleGlobalMessage", error)
    }
    return
};
async function addFriend({ data, sendTo }, socket, io) {
    return io.to(sendTo).emit('newFriendRequest', data);
};
async function acceptFriend({ data, sendTo }, socket, io) {
    // lookup user by their id find their socket

    const user = await sharedQueries.findUserByID(sendTo._id);
    const sentToSocket = user.socket;
    if (user) {
        io.to(sentToSocket).emit('Request Accepted', data);
    }

}
module.exports = {
    login,
    joinGlobal,
    handleGlobalMessage,
    handleGlobalDisconnect,
    acceptFriend,
    addFriend,
}