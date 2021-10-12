const db = require('../config/connection');
const { User, Location } = require('../models');

db.once('open', async () => {
  try {
    await User.deleteMany({});
    await Location.deleteMany({});
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


    // create server for global chat
    const user = await User.create({ ...userData })
    console.log('User created!', user)
    const locationData = {
      username: user.username,
      latitude: 29.1733504,
      longitude: -82.116608,
      city: 'Ocala',
      state: 'Florida'
    }
    const location = await Location.create({ ...locationData });
    if (location !== null || location !== undefined) {
      // find our user and add the location ID to the user info.
      const id = location._id
      const updatedUserData = await User.findByIdAndUpdate(user._id, {
        location: id
      }, { new: true }).select('-__v -password -email');
      console.log(`Updated user data`, updatedUserData);
    }
  } catch (error) {
    console.log(error);
  }

  console.log('all done!');
  process.exit(0);
});
