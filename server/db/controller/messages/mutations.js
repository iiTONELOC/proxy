const { Message, Channel } = require('../../models');
const { AuthenticationError } = require('apollo-server-express');

const handleName = async (name) => {
    switch (name) {
        case 'Global':
            const c = Channel.findOne({ name: 'Proxy Chat' });
            return c._id;
        default:
            return
    }
}
const messageMutation = {
    createMessage: async (parent, args, context) => {
        console.log(`create Message mutation`, { args, context })
        const { value, username, chat } = args;
        const { _id } = context;
        if (!_id) throw new AuthenticationError('You must be logged in to do that!');
        const msgData = {
            text: value,
            channel: handleName(chat),
            sender: username
        };
        return Message.create({ ...msgData });
    },
}

module.exports = messageMutation;