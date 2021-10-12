const { Schema, model } = require('mongoose');


const locationSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: false,
            default: null
        },
        state: {
            type: String,
            required: false,
            default: null
        }
    },
);

const Location = model('Location', locationSchema);
module.exports = Location;
