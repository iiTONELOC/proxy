const IpLocation = require('../../../utils/ipLoc');
const { signToken } = require('../../../utils/middleware/auth');
const { AuthenticationError } = require('apollo-server-express');
const {
    User,
    Server,
    Channel,
    Profile,
    Location,
    OnlineStatus,
} = require("../../models");
const {
    addChannelToServer, updateUserStatus, updateUserLocation
} = require('../sharedMutations')

async function returnLocation(args, ip) {

    let data
    if (args.latitude && args.latitude !== null && args.latitude !== undefined) {
        const { latitude, longitude } = args;
        const { city, state } = await IpLocation.user(null, ip);
        data = {
            latitude,
            longitude,
            city,
            state
        }
    } else {
        data = { latitude, longitude, city, state } = await IpLocation.user(args, ip);
    }
    return data
}

const userMutations = {
    async createNewUser(parent, args, { ip }) {
        let LOC_ID, STATUS_ID, SERVER_ID, PROFILE_ID, UPDATED_S_ID;
        const data = await returnLocation(args, ip)
        try {
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
                console.error(`createNewUser- failed creating Location Model`, error);
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
                console.error(`createNewUser- Status creation failed`, error);
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
                OnlineStatus.findByIdAndDelete(STATUS_ID);
                console.error(`createNewUser- Profile creating failed`, error);
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
                OnlineStatus.findByIdAndDelete(STATUS_ID);
                Profile.findByIdAndDelete(PROFILE_ID);
                console.error(`createNewUser server creation failed`, error);
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
                const updatedServer = await addChannelToServer({ ...servUp });
                UPDATED_S_ID = updatedServer._id;
                //  update server with channel id,
            } catch (error) {
                User.findByIdAndDelete(user._id);
                Location.findByIdAndDelete(LOC_ID);
                OnlineStatus.findByIdAndDelete(STATUS_ID);
                Profile.findByIdAndDelete(PROFILE_ID);
                console.error(`createNewUser- channel creation failed`, error);
                return error
            }
            // update the user with location, status, and updatedServer
            // and the server has the channels
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                location: LOC_ID,
                status: STATUS_ID,
                profile: PROFILE_ID,
                $addToSet: { servers: UPDATED_S_ID }
            }, { new: true }).select('-__v -password -email');
            const token = signToken(user);
            return {
                token,
                user: updatedUser
            };
        } catch (error) {
            const data = { ...error };
            const { keyValue } = data;
            if (error.code === 11000) {
                const { username, email } = keyValue
                const duplicate = username ? 'username' : email ? 'email' : error;
                // noting was created, return a message to the user
                throw new Error(`That ${duplicate} already exists!`)
            } else {
                console.error(`createNewUser - previously unknown error caught`, error);
                return error
            }
        };
    },

    async loginUser(parent, { email, username, password }, { ip }) {
        // use sharedMutation to update the onlineStatus for the user when logging in
        const user = await User.findOne({ email })
            .populate('location')
            .populate('status')
            .populate('profile')
            .populate({ path: 'servers', populate: { path: 'channels' } });
        if (!user) {
            throw new AuthenticationError('Incorrect credentials');
        } else {
            const correctPw = user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            };
            try {
                const locationData = await returnLocation({ args: undefined }, ip);
                await updateUserStatus(user.status._id, { online: true });
                await updateUserLocation(user.location._id, locationData);
            } catch (error) {
                console.error('Error updating data while logging in', error);
                return error
            };
            // return user and token
            const token = signToken(user);
            return { token, user };
        };
    },

}

module.exports = userMutations