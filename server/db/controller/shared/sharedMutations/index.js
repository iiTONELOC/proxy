const { Server, OnlineStatus, Location, User, Channel } = require('../../../models')

const sharedMutations = {
    updateUserStatus: (_id, status) => {
        return OnlineStatus.findByIdAndUpdate(_id, { ...status })
    },
    updateUserSocket: (_id, socket) => {
        if (_id && socket) {
            return User.findByIdAndUpdate(_id, { socket: socket }, { new: true })
                .select('-__v -password -email')
                .populate('location')
                .populate('status')
                .populate('profile')
                .populate({ path: 'friends', populate: ['location', 'profile', 'status', 'servers'] })
                .populate({ path: 'incomingRequests', populate: ['location', 'profile', 'status', 'servers'] })
                .populate('pendingRequests')
                .populate({ path: 'servers', populate: { path: 'channels' } })
        } else {
            return null
        }
    },
    updateUserLocation: (_id, locationData) => {
        return Location.findByIdAndUpdate(_id, { ...locationData })
    },
    addChannelToServer: ({ server, channel }) => {
        return Server.findByIdAndUpdate(server, {
            $addToSet: { channels: channel }
        });
    },
    // add message to channel
    addMessageToChannel: ({ channel, message }) => {
        return Channel.findOneAndUpdate({ name: channel }, {
            $addToSet: { messages: message }
        });
    }
}

module.exports =
    sharedMutations
