const mongoose = require('mongoose');
mongoose.set('runValidators', true);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/myDATABASE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(res => res.connection.getClient());

const DB = mongoose.connection;
module.exports = DB;
