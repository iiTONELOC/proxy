const mongoose = require('mongoose');
const { Schema, model } = mongoose
const bcrypt = require('bcrypt');
const { getDistances } = require('./virtuals/user')
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must match an email address!']
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    socket: {
      type: String,
      required: false,
      default: null
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location'
    },
    friends: [{
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'User'
    }],
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: 'OnlineStatus'
    },
    servers: [{
      type: Schema.Types.ObjectId,
      ref: 'Server'
    }],
    incomingRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    ],
    pendingRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    ],

  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    }
  }
);

// set up pre-save middleware to create password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});
userSchema.methods.isCorrectPassword = function (password) {
  return bcrypt.compare(password, this.password);
};
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

userSchema.virtual('usersInRange').get(async function () {
  const Users = await User.find({})
    .select('-__v -password -email')
    .populate('location')
    .populate('status')
    .populate('profile')
    .populate('friends')
    .populate('incomingRequests')
    .populate('pendingRequests')
    .populate({ path: 'servers', populate: { path: 'channels' } })
  const radius = 250;
  return getDistances(this, Users, radius);
});

const User = mongoose.models.User || model('User', userSchema);

module.exports = User;

