const { Schema, model } = require('mongoose');

const messageSchema = new Schema(
    {
        text: {
            type: String,
            required: [true, 'Messages must have content!'],
            maxLength: 280
        },
        time: {
            type: Date,
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

const Message = model('Message', messageSchema);
module.exports = Message;