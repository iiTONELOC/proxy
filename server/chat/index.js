

class Connection {
    constructor(io, socket) {
        this.io = io,
            this.socket = socket,
            socket.on('connected', (data) => {
                const socketData = {
                    socket_id: socket.id,
                    data
                }
                console.log(`socket connected`, socketData)
            })
    }
};

function Chat(io) {
    io.on('connection', (socket) => {
        new Connection(io, socket)
    })
};
module.exports = { Chat }