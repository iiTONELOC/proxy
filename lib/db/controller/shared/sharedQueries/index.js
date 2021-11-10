const { User } = require('../../../models')
const sharedQueries = {
    findUserByID: async function (_id) {

        const user = await User.findOne({ _id: _id })
            .select('-__v -password -email')
            .populate('location')
            .populate('status')
            .populate('profile')
            .populate({ path: 'friends', populate: ['location', 'profile', 'status', 'servers'], select: '-__v -password -email' })
            .populate({ path: 'incomingRequests', populate: ['location', 'profile', 'status', 'servers'], select: '-__v -password -email' })
            .populate({ path: 'pendingRequests', select: '-__v -password -email' })
            .populate({ path: 'servers', populate: { path: 'channels' } })
            ;
        return user
    },
}

module.exports = sharedQueries