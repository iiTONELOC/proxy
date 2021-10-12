const db = require('../config/connection');
const { User } = require('../models');

db.once('open', async () => {
  try {
    await User.deleteMany({});

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

  } catch (error) {
    console.log(error);
  }

  console.log('all done!');
  process.exit(0);
});
