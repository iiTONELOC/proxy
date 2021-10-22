const { User } = require('../../../models')
const sharedQueries = {
    findUserByID: (_id) => {
        return User.findById(_id).select().select('-__v -password -email')
            .populate('location')
            .populate('status')
            .populate('profile')
            .populate({ path: 'servers', populate: { path: 'channels' } })
    },
}

module.exports = { sharedQueries }