const { Server } = require('../models')

const sharedMutations = {

    updateServerWithNewChannel: ({ server, channel }) => {
        return Server.findByIdAndUpdate(server, {
            $push: { channels: channel }
        });
    },
}

module.exports =
    sharedMutations
