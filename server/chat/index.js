const { login, joinGlobal, handleGlobalDisconnect, handleGlobalMessage, addFriend, acceptFriend, reject, removeUser } = require("./chatResolver")
const { actions, reactions } = require("./actions");
const { _socket_user_login, JOIN_GLOBAL_CHAT } = actions;
// const { _authenticated } = reactions
class Connection {
    constructor(io, socket) {
        this.io = io,
            this.socket = socket,
            this.socket.on(_socket_user_login, (data) => { login(data, socket, io) }),
            this.socket.on(JOIN_GLOBAL_CHAT, (data) => { joinGlobal(data, socket, io) }),
            this.socket.on('globalChatMessage', (message) => { handleGlobalMessage(message, socket, io) }),
            this.socket.on('sendFriendRequest', (data) => { addFriend(data, socket, io) }),
            this.socket.on('acceptedFriendRequest', (data) => { acceptFriend(data, socket, io) }),
            this.socket.on('rejectRequest', (data) => { reject(data, socket, io) }),
            this.socket.on('removedUser', (data) => { removeUser(data, socket, io) })
    }
};

function Chat(io) {
    io.on('connection', (socket) => {
        new Connection(io, socket);
        socket.on('disconnect', (data) => {
            handleGlobalDisconnect(socket, io)
        });
    });


};
module.exports = { Chat }