const { login } = require("./chatResolver")
const { actions, reactions } = require("./actions");
const { _socket_user_login } = actions;
const { _authenticated } = reactions
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