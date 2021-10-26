const { login, joinGlobal, handleGlobalDisconnect, handleGlobalMessage } = require("./chatResolver")
const { actions, reactions } = require("./actions");
const { _socket_user_login, JOIN_GLOBAL_CHAT } = actions;
// const { _authenticated } = reactions
class Connection {
    constructor(io, socket) {
        this.io = io,
            this.socket = socket,
            this.socket.on(_socket_user_login, (data) => { login(data, this.socket, this.io) }),
            this.socket.on(JOIN_GLOBAL_CHAT, (data) => { joinGlobal(data, this.socket, this.io) }),
            this.socket.on('globalChatMessage', (message) => { handleGlobalMessage(message, this.socket, this.io) })

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