const { Schema, model } = require('mongoose');

const profileSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            required: true,
            maxLength: 280,
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
        ProfilePicture: {
            type: String,
            required: false,
            default: null
        }
    },
);

const Profile = model('Profile', profileSchema);
module.exports = Profile