

const login = ({ request, data }, socket, io) => {
    console.log(`user requesting login`, { request, data });
    io.to(socket.id).emit('logged', data)
}

module.exports = { login }