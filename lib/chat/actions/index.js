
// emitted by client
const actions = {
    _socket_user_login: 'user requesting login',
    _socket_user_logout: 'user logged out',
    JOIN_GLOBAL_CHAT: 'join global chat',
}
// emitted by server
const reactions = {
    _authenticated: 'authenticated'
}
module.exports = {
    actions,
    reactions
}