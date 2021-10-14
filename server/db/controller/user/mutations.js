const IpLocation = require('../../../utils/ipLoc');
const { signToken } = require('../../../utils/auth');
const {
    User,
    Server,
    Channel,
    Profile,
    Location,
    OnlineStatus,
} = require("../../models");
const {
    updateServerWithNewChannel
} = sharedMutations = require('../sharedMutations')

const userMutations = {
    async createNewUser(parent, args, { ip }) {
        let data, LOC_ID, STATUS_ID, SERVER_ID, PROFILE_ID, UPDATED_S_ID;
        try {
            if (args.latitude && args.latitude !== null || args.latitude !== undefined) {
                data = { latitude, longitude, city, state } = args
            } else {
                data = { latitude, longitude, city, state } = await IpLocation.user(args, ip);
            }
            const userData = {
                username,
                email,
                password,
            } = args;
            const user = await User.create({ ...userData });
            const USERNAME = user.username;
            data.username = USERNAME;
            try {
                const location = await Location.create({ ...data });
                LOC_ID = location._id;
            } catch (error) {
                // something failed, check logs
                // either way we have to delete the user
                User.findByIdAndDelete(user._id);
                console.error(`createNewUser`, error);
                return error
            }
            try {
                // create Status
                const statusData = {
                    username: USERNAME,
                    online: true,
                    status: 'active'
                };
                const status = await OnlineStatus.create({ ...statusData });
                STATUS_ID = status._id;
            } catch (error) {
                User.findByIdAndDelete(user._id);
                Location.findByIdAndDelete(LOC_ID);
                console.error(`createNewUser`, error);
                return error
            }
            try {
                const profileData = {
                    username: USERNAME,
                    location: LOC_ID,
                    profilePicture: args.profilePicture ? args.profilePicture : null
                }
                const profile = await Profile.create({ ...profileData });
                PROFILE_ID = profile._id;
            } catch (error) {
                User.findByIdAndDelete(user._id);
                Location.findByIdAndDelete(LOC_ID);
                Status.findByIdAndDelete(STATUS_ID);
                console.error(`createNewUser`, error);
                return error
            }
            try {
                // create a server
                const serverData = {
                    name: `default server`,
                    description: `${USERNAME}'s public server`,
                    private: false,
                    ownerName: USERNAME
                };
                const server = await Server.create({ ...serverData });
                SERVER_ID = server._id;
            } catch (error) {
                User.findByIdAndDelete(user._id);
                Location.findByIdAndDelete(LOC_ID);
                Status.findByIdAndDelete(STATUS_ID);
                Profile.findByIdAndDelete(PROFILE_ID);
                console.error(`createNewUser`, error);
                return error
            }
            try {
                // create a channel
                const channelData = {
                    name: `${USERNAME}'s public channel`,
                    description: `${USERNAME}'s public server`,
                    private: false,
                    ownerName: USERNAME,
                    location: LOC_ID,
                    server: SERVER_ID
                };
                const channel = await Channel.create({ ...channelData });
                const servUp = {
                    server: SERVER_ID,
                    channel: channel._id
                };
                const updatedServer = updateServerWithNewChannel({ ...servUp });
                UPDATED_S_ID = updatedServer._id;
                //  update server with channel id,
            } catch (error) {
                User.findByIdAndDelete(user._id);
                Location.findByIdAndDelete(LOC_ID);
                Status.findByIdAndDelete(STATUS_ID);
                Profile.findByIdAndDelete(PROFILE_ID);
                console.error(`createNewUser`, error);
                return error
            }


            // update the user with location, status, and updatedServer
            // and the server has the channels
            const updatedUserData = await User.findByIdAndUpdate(user._id, {
                location: LOC_ID,
                status: STATUS_ID,
                profile: PROFILE_ID,
                $push: { servers: UPDATED_S_ID }
            }, { new: true }).select('-__v -password -email');
            const token = signToken(user);
            return {
                token,
                user: updatedUserData
            };
        } catch (error) {
            console.error(`createNewUser`, error);
            return error;
        };
    },
}

module.exports = userMutations