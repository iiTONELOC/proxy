const { User } = require("../../models");
const sharedQueries = require('../shared/sharedQueries');
const { AuthenticationError } = require('apollo-server-express');
const Distance = require("../../../utils/Distance");
const IpLocation = require('../../../utils/ipLoc');
const { findUserByID } = sharedQueries;
async function isOurServer(context) {
    const incomingStream = context?.socket?.parser?.incoming?.headers
    const { origin, host } = incomingStream ? incomingStream : {};
    if (!context?.user) {
        if (origin == undefined) {
            if (host == 'localhost:3001') {
                return true
            }
            return false
        } else {
            return false
        }
    } else {
        return false
    }
}

const userQueries = {
    async findAll(parent, args, context) {
        const ourServer = await isOurServer(context);
        if (ourServer == false) {
            const userData = await User.find({})
                .select('-__v -password -email')
                .populate('location')
                .populate('status')
                .populate('profile')
                .populate({ path: 'friends', populate: ['location', 'profile', 'status', 'servers'], select: '-__v -password -email' })
                .populate({ path: 'incomingRequests', populate: ['location', 'profile', 'status', 'servers'], select: '-__v -password -email' })
                .populate({ path: 'pendingRequests', select: '-__v -password -email' })
                .populate({ path: 'servers', populate: { path: 'channels' } })
                ;
            return userData;
        } else {
            const userData = await User.find({})
                .select('-__v -password -email')
                .populate('location')
                .populate('status')
                .populate('profile')
                .populate({ path: 'friends', populate: ['location', 'profile', 'status', 'servers'], select: '-__v -password -email' })
                .populate({ path: 'incomingRequests', populate: ['location', 'profile', 'status', 'servers'], select: '-__v -password -email' })
                .populate({ path: 'pendingRequests', select: '-__v -password -email' })
                .populate({ path: 'servers', populate: { path: 'channels' } })
                ;
            return userData;
        }
    },
    async serverFindMe(parent, args, context) {
        let { user } = args || {};
        const ourServer = await isOurServer(context);

        if (!args && !context) {
            const { user } = parent.args
            try {
                const uData = await User.findOne({ _id: user })
                    .select('-__v -password -email')
                    .populate('location')
                    .populate('status')
                    .populate('profile')
                    .populate({ path: 'friends', populate: ['location', 'profile', 'status', 'servers'], select: '-__v -password -email' })
                    .populate({ path: 'incomingRequests', populate: ['location', 'profile', 'status', 'servers'], select: '-__v -password -email' })
                    .populate({ path: 'pendingRequests', select: '-__v -password -email' })
                    .populate({ path: 'servers', populate: { path: 'channels' } })
                    ;
                return uData;
            } catch (error) {
                console.error(error);
                return null
            }

        }

        if (ourServer == false) {
            returns
        } else {
            if (!context.user) {
                const userData = await findUserByID(user);
                return userData;
            }
        }
    },

    async findMe(parent, args, context) {
        if (!context.user) {
            throw new AuthenticationError('Not logged in');
        } else {
            return await findUserByID(context.user._id);
        }
    },
    async getDistance(parent, args, context) {
        const { lat1, lon1 } = args
        const { latitude, longitude } = await IpLocation.user(null, context.IP);
        const distance = Distance(lat1, lon1, latitude, longitude, 'miles').toFixed(1).toString()
        return { distance }
    },


}

module.exports = { userQueries, }
