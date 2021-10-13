const { User } = require("../../models");
const Location = require('../../../utils/Location');
const userQueries = {

    async findAll(parent, args, { context, ip }) {

        const l = await Location.user(args, ip);
        console.log('Users location captured on server', l)
        const userData = await User.find({})
            .select('-__v -password -email')
            .populate('location')
            .populate('status')
            .populate('profile')
            .populate({ path: 'servers', populate: { path: 'channels' } });
        return userData;
    },


}

module.exports = userQueries
