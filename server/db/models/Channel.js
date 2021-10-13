const { Schema, model } = require('mongoose');

const channelSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Enter a name for your channel']
        },
        description: {
            type: String,
            required: [true, 'Enter a short description for your channel'],
            maxLength: 50
        },
        private: {
            type: Boolean,
            required: [true, "You must select your channels's privacy"],
        },
        ownerName: {
            type: String,
            required: [true, "Enter the owner's name"],
        },
        location: {
            type: Schema.Types.ObjectId,
            ref: 'Location'
        },
        messages: [{
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }],
        active: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        server: [{
            type: Schema.Types.ObjectId,
            ref: 'Server'
        }],
    },
);

const Channel = model('Channel', channelSchema);
module.exports = Channel;