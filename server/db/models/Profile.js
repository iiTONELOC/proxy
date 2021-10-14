const { Schema, model } = require('mongoose');

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

const Profile = model('Profile', profileSchema);
module.exports = Profile