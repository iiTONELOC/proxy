const mongoose = require('mongoose');
const { Schema, model } = mongoose

const statusSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required to create a status']
        },
        online: {
            type: Boolean,
            required: [true, 'online property is required']
        },

        status: {
            type: String,
            enum: ['active', 'busy', 'away', 'do not disturb']
        }
    },
);

const OnlineStatus = mongoose.models.OnlineStatus || model('OnlineStatus', statusSchema);
module.exports = OnlineStatus;