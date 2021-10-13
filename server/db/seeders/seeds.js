const db = require('../config/connection');
const { User, Location, Profile, OnlineStatus, Server, Channel } = require('../models');

db.once('open', async () => {
  try {
    await User.deleteMany({});
    await Location.deleteMany({});
    await Profile.deleteMany({})
    console.log(`db successfully deleted`)
  } catch (error) {
    throw new Error('Unable to delete Database');
  }

  try {
    const userData = {
      username: 'test',
      email: 'test@test.com',
      password: "testtest"
    }


    // create user
    const user = await User.create({ ...userData })
    const USERNAME = user.username
    const locationData = {
      username: USERNAME,
      latitude: 29.1733504,
      longitude: -82.116608,
      city: 'Ocala',
      state: 'Florida'
    }
    // create users location
    const location = await Location.create({ ...locationData });
    if (location !== null || location !== undefined) {
      // find our user and add the location ID to the user info.
      const id = location._id

      // create users Profile
      const profileData = {
        username: USERNAME,
        bio: "Hello, my name is blah blah blah.",
        visible: true,
        location: id,
      }
      const statusData = {
        username: USERNAME,
        online: true,
        status: 'active'
      };
      const status = await OnlineStatus.create({ ...statusData });
      const profile = await Profile.create({ ...profileData });
      // create a server
      const serverData = {
        name: `default server`,
        description: `${USERNAME}'s public server`,
        private: false,
        ownerName: USERNAME
      }
      const server = await Server.create({ ...serverData })
      // create a channel
      const channelData = {
        name: `${USERNAME}'s public channel`,
        description: `${USERNAME}'s public server`,
        private: false,
        ownerName: USERNAME,
        location: id,
        server: server._id
      }
      const channel = await Channel.create({ ...channelData })
      //  update server with channel id,
      const updatedServer = await Server.findByIdAndUpdate(server._id, {
        $push: { channels: channel._id }
      });
      // update the user with location, profile, status, and updatedServer
      const updatedUserData = await User.findByIdAndUpdate(user._id, {
        location: id,
        profile: profile._id,
        status: status._id,
        $push: { servers: updatedServer._id }
      }, { new: true }).select('-__v -password -email');
      console.log(`Updated user data`, updatedUserData);
    }
  } catch (error) {
    console.log(error);
  }

  console.log('all done!');
  process.exit(0);
});
