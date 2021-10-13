const IpLocation = require('../../../utils/ipLoc');
const { signToken } = require('../../../utils/auth');
const {
    User,
    Server,
    Channel,
    Location,
    OnlineStatus,
} = require("../../models");
const {
    updateServerWithNewChannel
} = sharedMutations = require('../sharedMutations')
/*

    Creating a new user is a process, since most the info is divided into their own models
*/
// 
const userMutations = {
    async createNewUser(parent, args, { ip }) {
        let data
        if (args.longitude || args.longitude !== null || args.longitude !== 'null') {
            data = { latitude, longitude, city, state } = args
        }

        try {
            if (!latitude || latitude === 'null') {
                data = { latitude, longitude, city, state } = await IpLocation.user(args, ip);
            }
            // grabs our location from the server or returns the users location

            // create a base user with location data, we need the users _id and
            // location_id for the next steps
            // user first
            const userData = {
                username,
                email,
                password,
            } = args
            const user = await User.create({ ...userData });
            const USERNAME = user.username
            data.username = USERNAME
            const location = await Location.create({ ...data });
            const LOC_ID = location._id;
            // create Status
            const statusData = {
                username: USERNAME,
                online: true,
                status: 'active'
            };
            const status = await OnlineStatus.create({ ...statusData });
            const STATUS_ID = status._id;
            // create a server
            const serverData = {
                name: `default server`,
                description: `${USERNAME}'s public server`,
                private: false,
                ownerName: USERNAME
            }
            const server = await Server.create({ ...serverData });
            const SERVER_ID = server._id
            // create a channel
            const channelData = {
                name: `${USERNAME}'s public channel`,
                description: `${USERNAME}'s public server`,
                private: false,
                ownerName: USERNAME,
                location: LOC_ID,
                server: SERVER_ID
            }
            const channel = await Channel.create({ ...channelData })
            //  update server with channel id,
            const servUp = {
                server: SERVER_ID,
                channel: channel._id
            }
            const updatedServer = updateServerWithNewChannel({ ...servUp });
            const UPDATED_S_ID = updatedServer._id;
            // update the user with location, status, and updatedServer
            // and the server has the channels
            const updatedUserData = await User.findByIdAndUpdate(user._id, {
                location: LOC_ID,
                status: STATUS_ID,
                $push: { servers: UPDATED_S_ID }
            }, { new: true }).select('-__v -password -email');
            const token = signToken(user);
            return {
                token,
                user: updatedUserData
            }
        } catch (error) {
            console.error(`createNewUser`, error);
            return error;
        };
    },
}

module.exports = userMutations