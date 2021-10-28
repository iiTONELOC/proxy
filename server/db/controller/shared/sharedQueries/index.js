const { User } = require('../../../models')
const sharedQueries = {
    findUserByID: async function (_id) {
        const user = await User.findOne({ _id: _id })
            .select('-__v -password -email')
            .populate('location')
            .populate('status')
            .populate('profile')
            .populate('friends')
            .populate({ path: 'servers', populate: { path: 'channels' } })
            .populate('incomingRequests')
            .populate('pendingRequests')
            ;
        return user
    },
}

module.exports = sharedQueries