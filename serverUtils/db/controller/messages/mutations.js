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
        const { value, username, chat } = args;
        const { _id } = context;
        if (!_id) throw new AuthenticationError('You must be logged in to do that!');
        const msgData = {
            text: value,
            channel: await handleName(chat),
            sender: username
        };
        return Message.create({ ...msgData });
    },
    editMessage: async (parent, { messageId, text }, context) => {

        const { user } = context;
        if (!user) throw new AuthenticationError('You must be logged in to do that!');
        // check if message is valid and if it came from the user
        const isMessage = await Message.findById(messageId);
        if (isMessage !== null) {
            if (isMessage.sender === user?.username) {
                const msg = await Message.findByIdAndUpdate(
                    messageId,
                    { text: text },
                    { new: true }
                );
                return msg;
            } else {
                throw new AuthenticationError('You cannot edit this message!');
            }
        }
    },
};


module.exports = messageMutation;