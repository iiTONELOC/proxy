const mongoose = require('mongoose');
const { Schema, model } = mongoose

const serverSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Enter a name for your server']
        },
        description: {
            type: String,
            required: [true, 'Enter a short description for your server'],
            maxLength: 50
        },
        private: {
            type: Boolean,
            required: [true, "You must select your server's privacy"],
        },
        ownerName: {
            type: String,
            required: [true, "Enter owner's name"],
        },
        channels: [{
            type: Schema.Types.ObjectId,
            ref: 'Channel'
        }],
    },
);

const Server = mongoose.models.OnlineStatus || model('Server', serverSchema);
module.exports = Server;