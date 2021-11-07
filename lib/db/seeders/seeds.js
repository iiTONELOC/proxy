const db = require('../config/connection');
const { addChannelToServer } = require('../controller/shared/sharedMutations');

const { User, Server, Channel, Location, Profile, OnlineStatus, Message } = require('../models');

db.once('open', async () => {

  try {
    await User.deleteMany({});
    await Server.deleteMany({});
    await Channel.deleteMany({});
    await Profile.deleteMany({});
    await Message.deleteMany({});
    await Location.deleteMany({});
    await OnlineStatus.deleteMany({});

    console.log(`db successfully deleted\ncreating users please wait...`);

    const server = await Server.create({
      name: "Proxy Server",
      description: 'Proxy',
      private: false,
      ownerName: 'Proxy',
    });
    if (server !== null) {
      const channel = await Channel.create({
        name: "Proxy Chat",
        description: 'Proxy',
        private: false,
        ownerName: 'Proxy',
        server: server._id
      });
      if (channel !== null) {
        // update the server
        const updateData = {
          server: server._id,
          channel: channel._id
        };
        await addChannelToServer({ ...updateData });
        console.log(server, channel)
      }
    }

  } catch (error) {
    throw new Error('Unable to delete Database');
  }

  console.log('all done!');
  process.exit(0);

});
