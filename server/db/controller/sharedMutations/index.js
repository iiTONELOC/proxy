const { Server, OnlineStatus, Location } = require('../../models')

const sharedMutations = {
    updateUserStatus: (_id, status) => {
        return OnlineStatus.findByIdAndUpdate(_id, { ...status })
    },
    updateUserLocation: (_id, locationData) => {
        return Location.findByIdAndUpdate(_id, { ...locationData })
    },
    addChannelToServer: ({ server, channel }) => {
        return Server.findByIdAndUpdate(server, {
            $push: { channels: channel }
        });
    },
}

module.exports =
    sharedMutations
