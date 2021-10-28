const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/myDATABASE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(res => res.connection.getClient());

module.exports = mongoose.connection;
