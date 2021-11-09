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
} = require('../shared/sharedMutations');



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
    async createNewUser(parent, args, context) {
        let LOC_ID, STATUS_ID, SERVER_ID, PROFILE_ID, UPDATED_S_ID;
        const data = { latitude, longitude, city, state } = await IpLocation.user(args, context.IP);
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

    async loginUser(parent, { email, username, password }, context) {
        const ip = context.IP;
        // use sharedMutation to update the onlineStatus for the user when logging in
        const user = await User.findOne({ email })
            .select('-__v ')
            .populate('location')
            .populate('status')
            .populate('profile')
            .populate({ path: 'friends', populate: ['location', 'profile', 'status', 'servers'] })
            .populate({ path: 'incomingRequests', populate: ['location', 'profile', 'status', 'servers'] })
            .populate('pendingRequests')
            .populate({ path: 'servers', populate: { path: 'channels' } })
            ;
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

    async userLogout(parent, args, context) {
        const { _id, username } = context.user ? context.user : {};
        if (_id) {
            const updatedStatus = await OnlineStatus.findOneAndUpdate({ username: username },
                { online: false }, { new: true }
            )
            return updatedStatus
        } else {
            console.log(false);
            throw new AuthenticationError('You must be logged in!')
        }
    },

    async addFriend(parent, { friendId }, context) {
        // return null
        if (context.user) {
            // add the friendID to the pending array
            const userData = await User.findByIdAndUpdate(context.user._id,
                { $addToSet: { pendingRequests: friendId } },
                { new: true },
            ).select('-__v -password -email')
                .populate('location')
                .populate('status')
                .populate('profile')
                .populate({ path: 'friends', populate: ['location', 'profile', 'status', 'servers'] })
                .populate({ path: 'incomingRequests', populate: ['location', 'profile', 'status', 'servers'] })
                .populate('pendingRequests')
                .populate({ path: 'servers', populate: { path: 'channels' } })
                ;
            // update the 'friend' 
            // add userID to the friends request array
            const didAdd = await User.findByIdAndUpdate(friendId,
                { $addToSet: { incomingRequests: context.user._id } },
                { new: true })
            if (didAdd !== undefined || didAdd !== null) {
                return userData
            } else throw new Error('Could not add friend')
        }
        throw new AuthenticationError('You need to be logged in!');
    },

    async acceptFriend(parent, { friendId }, context) {
        if (context.user) {
            // add the friendID to the pending array
            const userData = await User.findByIdAndUpdate(context.user._id,
                {
                    $addToSet: { friends: friendId },
                    $pull: { incomingRequests: friendId }
                },
                { new: true },
            )
                .select('-__v -password -email')
                .populate('location')
                .populate('status')
                .populate('profile')
                .populate({ path: 'friends', populate: ['location', 'profile', 'status', 'servers'] })
                .populate({ path: 'incomingRequests', populate: ['location', 'profile', 'status', 'servers'] })
                .populate('pendingRequests')
                .populate({ path: 'servers', populate: { path: 'channels' } })
                ;
            // update the 'friend' 
            // add userID to the friends request array
            const didAdd = await User.findByIdAndUpdate(friendId,
                {
                    $addToSet: { friends: context.user._id },
                    $pull: { pendingRequests: context.user._id }
                },
                { new: true },
            ).select('-__v -password -email')

            if (didAdd !== undefined || didAdd !== null) {
                return userData
            } else {
                throw new Error('Something went wrong!')
            }
        }
        throw new AuthenticationError('You need to be logged in!');
    },
    rejectFriend: async (parent, { friendId }, context) => {
        if (context.user) {
            const userData = await User.findOneAndUpdate(
                { _id: context.user._id },
                {
                    $pull: { incomingRequests: friendId }
                },
                { new: true }
            )
                .select('-__v -password -email')
                .populate('location')
                .populate('status')
                .populate('profile')
                .populate({ path: 'friends', populate: ['location', 'profile', 'status', 'servers'] })
                .populate({ path: 'incomingRequests', populate: ['location', 'profile', 'status', 'servers'] })
                .populate('pendingRequests')
                .populate({ path: 'servers', populate: { path: 'channels' } })
                ;
            // update the 'friend' 
            // add userID to the friends request array
            const didRemove = await User.findOneAndUpdate(
                { _id: friendId },
                {
                    $pull: {
                        incomingRequests: context.user._id,
                        pendingRequests: context.user._id
                    }
                },
                { new: true }
            ).select('-__v -password -email')
            if (didRemove !== undefined || didRemove !== null) {
                return didRemove
            }
        }
        throw new AuthenticationError('You need to be logged in!');
    },

    removeSelectedFriend: async (parent, { friendId }, context) => {
        if (context.user) {
            const userRemovedFromFriend = await User.findByIdAndUpdate(friendId, {
                $pull: { friends: context.user._id }
            });
            if (userRemovedFromFriend) {
                const updatedUser = await User.findByIdAndUpdate(context.user._id,
                    {
                        $pull: { friends: friendId }
                    },
                    { new: true })
                    .select('-__v -password -email')
                    .populate('location')
                    .populate('status')
                    .populate('profile')
                    .populate({ path: 'friends', populate: ['location', 'profile', 'status', 'servers'] })
                    .populate({ path: 'incomingRequests', populate: ['location', 'profile', 'status', 'servers'] })
                    .populate('pendingRequests')
                    .populate({ path: 'servers', populate: { path: 'channels' } })
                    ;
                return updatedUser
            } else {
                throw new AuthenticationError('You need to be logged in!');
            }
        }
    },
    editProfilePicture: async (parent, { picture }, context) => {
        if (context.user) {
            const data = await User.findById(context.user._id);
            const _id = data.profile._id

            const updatedProfile = await Profile.findByIdAndUpdate(_id, {
                profilePicture: picture
            }, { new: true })

            if (updatedProfile !== null) {
                return updatedProfile
            }
        } else {
            throw new AuthenticationError('You need to be logged in!');
        }
    },
}

module.exports = userMutations