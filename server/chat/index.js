const { login, joinGlobal, handleGlobalDisconnect, handleGlobalMessage, addFriend } = require("./chatResolver")
const { actions, reactions } = require("./actions");
const { _socket_user_login, JOIN_GLOBAL_CHAT } = actions;
// const { _authenticated } = reactions
class Connection {
    constructor(io, socket) {
        this.io = io,
            this.socket = socket,
            this.socket.on(_socket_user_login, (data) => { login(data, this.socket, this.io) }),
            this.socket.on(JOIN_GLOBAL_CHAT, (data) => { joinGlobal(data, this.socket, this.io) }),
            this.socket.on('globalChatMessage', (message) => { handleGlobalMessage(message, this.socket, this.io) }),
            this.socket.on('sendFriendRequest', (data) => { addFriend(data, this.socket, io) }),
            this.socket.on('acceptedFriendRequest', (data) => { io.to(data.userData.socket).emit('Request Accepted', data) })
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