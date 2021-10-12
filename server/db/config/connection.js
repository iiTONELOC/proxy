

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/proxy-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(res => res.connection.getClient());

module.exports = mongoose.connection;
