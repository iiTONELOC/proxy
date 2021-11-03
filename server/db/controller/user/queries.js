const { User } = require("../../models");
const sharedQueries = require('../shared/sharedQueries');
const { AuthenticationError } = require('apollo-server-express');

const { findUserByID } = sharedQueries;
async function isOurServer(context) {
    const { origin, host, } = context.socket.parser.incoming.headers
    if (!context.user) {
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
            return
        } else {
            const userData = await User.find({})
                .select('-__v -password -email')
                .populate('location')
                .populate('status')
                .populate('profile')
                .populate({ path: 'friends', populate: ['location', 'profile', 'status', 'servers'] })
                .populate({ path: 'incomingRequests', populate: ['location', 'profile', 'status', 'servers'] })
                .populate('pendingRequests')
                .populate({ path: 'servers', populate: { path: 'channels' } })
                ;
            return userData;
        }
    },
    async serverFindMe(parent, args, context) {
        const ourServer = await isOurServer(context);
        const { user } = args
        if (ourServer == false) {
            return
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


}

module.exports = { userQueries, }
