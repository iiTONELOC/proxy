const db = require('../config/connection');
const { User, Location, Profile, OnlineStatus } = require('../models');

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

    const locationData = {
      username: user.username,
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
        username: user.username,
        bio: "Hello, my name is blah blah blah.",
        visible: true,
        location: id,
      }
      const statusData = {
        username: user.username,
        online: true,
        status: 'active'
      };
      const status = await OnlineStatus.create({ ...statusData });
      const profile = await Profile.create({ ...profileData });
      const updatedUserData = await User.findByIdAndUpdate(user._id, {
        location: id,
        profile: profile._id,
        status: status._id
      }, { new: true }).select('-__v -password -email');
      console.log(`Updated user data`, updatedUserData);
    }
  } catch (error) {
    console.log(error);
  }

  console.log('all done!');
  process.exit(0);
});
