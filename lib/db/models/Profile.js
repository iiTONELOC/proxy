const mongoose = require('mongoose');
const { Schema, model } = mongoose

const profileSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            required: false,
            maxLength: 280,
            default: null
        },
        visible: {
            type: Boolean,
            required: false,
            default: true
        },
        location: {
            type: Schema.Types.ObjectId,
            ref: 'Location'
        },
        profilePicture: {
            type: String,
            required: false,
            default: null
        }
    },
);

const Profile = mongoose.models.OnlineStatus || model('Profile', profileSchema);
module.exports = Profile