

const login = ({ request, data }, socket, io) => {

    io.to(socket.id).emit('logged', data)
}

module.exports = { login }