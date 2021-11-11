const mongoose = require('mongoose');
const { Schema, model } = mongoose
const messageSchema = new Schema(
    {
        text: {
            type: String,
            required: [true, 'Messages must have content!'],
            maxLength: 280
        },
        time: {
            type: Number,
            default: Date.now,
        },
        sender: {
            type: String,
            required: [true, "Messages must have a sender!"],
        },
        channel: {
            type: Schema.Types.ObjectId,
            ref: 'Channel'
        },
    },
);

const Message = mongoose.models.Message || model('Message', messageSchema);
module.exports = Message;