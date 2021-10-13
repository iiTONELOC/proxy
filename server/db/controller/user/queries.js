const { User } = require("../../models");
// remove this after testing
const IpLocation = require('../../../utils/ipLoc');
// 

const userQueries = {
    async findAll(parent, args, { ip, user }) {
        // const l = await IpLocation.user(args, ip);
        // console.log('Users location captured on server', l)
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
