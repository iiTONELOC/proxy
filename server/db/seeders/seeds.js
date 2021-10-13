const db = require('../config/connection');
const { User, Server, Channel, Location, Profile, OnlineStatus, } = require('../models');

db.once('open', async () => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      await User.deleteMany({});
      await Server.deleteMany({});
      await Channel.deleteMany({});
      await Profile.deleteMany({});
      await Location.deleteMany({});
      await OnlineStatus.deleteMany({});
      console.log(`db successfully deleted`)
    } catch (error) {
      throw new Error('Unable to delete Database');
    }

    console.log('all done!');
    process.exit(0);
  } else {
    console.log('NOT ALLOWED');
  }
});
