const { login } = require("./chatResolver")
const { _socket_user_login } = require("./socketActions");

class Connection {
    constructor(io, socket) {
        this.io = io,
            this.socket = socket,
            this.socket.on(_socket_user_login, (data) => { login(data, this.socket, this.io) })
    }
};

function Chat(io) {
    io.on('connection', (socket) => {
        new Connection(io, socket)
    })
};
module.exports = { Chat }