const { User } = require("../../models");
const { sharedQueries } = require('../shared/sharedQueries');
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
                .populate({ path: 'servers', populate: { path: 'channels' } })
                ;
            return userData;
        }
    },
    async serverUser(parent, args, context) {
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
    }
}

module.exports = { userQueries }