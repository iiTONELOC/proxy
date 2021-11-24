const {
    login,
    reject,
    addFriend,
    joinGlobal,
    removeUser,
    acceptFriend,
    handleEditMessage,
    handleGlobalMessage,
    handleGlobalDisconnect,
} = require("./chatResolver")

class Connection {
    constructor(io, socket) {
        this.io = io,
            this.socket = socket,
            this.socket.on('rejectRequest', (data) => { reject(data, socket, io) }),
            this.socket.on('removedUser', (data) => { removeUser(data, socket, io) }),
            this.socket.on('join global chat', (data) => { joinGlobal(data, socket, io) }),
            this.socket.on('sendFriendRequest', (data) => { addFriend(data, socket, io) }),
            this.socket.on('user requesting login', (data) => { login(data, socket, io) }),
            this.socket.on('editMessage', (data) => { handleEditMessage(data, socket, io) }),
            this.socket.on('acceptedFriendRequest', (data) => { acceptFriend(data, socket, io) }),
            this.socket.on('globalChatMessage', (message) => { handleGlobalMessage(message, socket, io) })
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