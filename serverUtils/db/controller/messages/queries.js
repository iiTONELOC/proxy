const { Message } = require('../../models');


const messageQueries = {
    globalMessages: async (parent, args, context) => {
        return Message.find({ name: 'Proxy Chat' });
    },
};
module.exports = messageQueries;