const sharedMutations = require('../db/controller/shared/sharedMutations');
const { findUserByID } = require("../db/controller/shared/sharedQueries");
const { createMessage, editMessage, deleteMessage } = require("../db/controller/messages/mutations");
const sharedQueries = require('../db/controller/shared/sharedQueries');
const { actions, reactions } = require("./actions");
const { Message } = require('../db/models');
const { updateUserSocket } = sharedMutations;
const { _socket_user_login } = actions;
const { _authenticated } = reactions;
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
function alertFriends(friends, io) {
    if (friends.length > 0) {
        friends.forEach(friend => {
            io.to(friend.socket).emit('updateFriendsList');
        });
    };
};

const login = async ({ request, data }, socket, io) => {
    // eventually want to include an auth middleware on the socket
    if (request == _socket_user_login) {
        const { id } = data;
        try {
            const socketData = socket.id;
            const isUser = await updateUserSocket(id, socketData);
            if (isUser !== null) {
                socket.USER = {
                    _id: isUser._id,
                    username: isUser.username,
                    socket: isUser.socket,
                }
                socket.CURRENT = 'landing';
                // emit to our friends we are online
                const friends = isUser.friends;

                alertFriends(friends, io);
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
    if (globalChatArray.length > 0 && socket.USER) {
        const inChat = alreadyJoined(globalChatArray, socket);
        if (inChat === false && socket.CURRENT !== 'Global') {
            globalChatArray.push({ user: user });
            socket.CURRENT = 'Global';
            usersInRange.forEach(user => io.to(user.socket).emit('updateUsersInRange'))
            socket.join('GlobalChat');
        } else {
            const socketData = socket.id;
            const isUser = await updateUserSocket(socket.USER._id, socketData);
            const updatedUserData = {
                _id: isUser._id,
                username: isUser.username,
                socket: isUser.socket,
            }
            socket.USER = updatedUserData;
            filterUserFromArray(socket);
            globalChatArray.push({ user: updatedUserData });
            usersInRange?.forEach(user => io.to(user.socket).emit('updateUsersInRange'))
            socket.join('GlobalChat');
            socket.CURRENT = 'Global';
        };
    } else {
        globalChatArray.push(user);
        socket.CURRENT = 'Global';
        usersInRange.forEach(user => io.to(user.socket).emit('updateUsersInRange'))
        socket.join('GlobalChat');
    }
};
const handleGlobalDisconnect = async (socket, io,) => {
    if (socket.USER !== undefined && socket.USER.username !== undefined) {
        const inChat = alreadyJoined(globalChatArray, socket);
        const uData = await sharedQueries.findUserByID(socket.USER._id);
        const online = uData?.status?.online;
        if (online === false && socket.CURRENT === 'Global') {
            filterUserFromArray(socket);
            alertFriends(uData.friends, io)
            return io.to(`GlobalChat`).emit('updateUsersInRange')
        } else if (online === false && inChat === false) {
            // user is logging out, not in global chat
            // only alert friends that they are offline
            alertFriends(uData.friends, io)
        } else {
            io.to(`GlobalChat`).emit('updateUsersInRange')
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
const handleEditMessage = async (message, socket, io) => {
    const username = socket.USER?.username;
    const msgData = await Message.findById(message.messageId);
    if (msgData.sender != username) {
        console.log('UNAUTHORIZED')
    } else {
        const data = {
            text: message.value,
            messageId: message.messageId,
        }
        const context = {
            user: {
                _id: socket.USER._id,
                username,
            }
        }
        const editMsgData = await editMessage(null, data, context)
        if (editMsgData != null) {
            io.emit(`updateMessage-${message.messageId}`, editMsgData)
        } else {
            console.error('COULD NOT UPDATE MESSAGE!', editMsgData)
        }
    }
};
const handleDeleteMessage = async (message, socket, io) => {
    const username = socket.USER?.username;
    const msgData = await Message.findById(message.messageId);
    if (msgData?.sender != username) {
        console.log('UNAUTHORIZED')
    } else {
        const data = {
            messageId: message.messageId,
        }
        const context = {
            user: {
                _id: socket.USER._id,
                username,
            }
        }
        const delMsgData = await deleteMessage(null, data, context)
        if (delMsgData != null) {
            io.emit(`deleteMessage`, delMsgData)
        } else {
            console.error('COULD NOT UPDATE MESSAGE!', delMsgData)
        }
    }
};
async function addFriend({ data, sendTo }, socket, io) {
    // lookup user by their id send their info to the user
    const user = await findUserByID(data.from.userID)
    const sendToData = await findUserByID(sendTo)
    return io.to(sendToData.socket).emit('newFriendRequest', user);
};
async function acceptFriend({ data, sendTo }, socket, io) {
    // lookup user by their id find their socket
    const id = sendTo._id
    const user = await findUserByID(id)
    const sentToSocket = user?.socket;
    if (user) {
        io.to(sentToSocket).emit('Request Accepted', data);
    }
};
async function reject({ data, sendTo }, socket, io) {
    // lookup user by their id find their socket
    const id = sendTo.userID || sendTo._id
    const user = await findUserByID(id)
    const sentToSocket = user?.socket;
    if (user) {
        io.to(sentToSocket).emit('Request Rejected', data);
    }
};
async function removeUser({ data, sendTo }, socket, io) {
    // lookup user by their id find their socket
    const id = sendTo.userID || sendTo._id
    const user = await findUserByID(id)
    const sentToSocket = user?.socket;
    if (user) {
        io.to(sentToSocket).emit('Removed', data);
    }
};
module.exports = {
    login,
    reject,
    addFriend,
    joinGlobal,
    removeUser,
    acceptFriend,
    handleEditMessage,
    handleDeleteMessage,
    handleGlobalMessage,
    handleGlobalDisconnect,
}