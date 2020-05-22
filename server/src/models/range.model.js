const mongoose = require('mongoose');
const { toJSON } = require('./utils');

const rangeSchema = mongoose.Schema({
    startDate: {
        type: String,

    },
    endDate: {
        type: String,

    },
    end: {
        type: Number,

    },
    start: {
        type: Number,

    },
    comment: {
        type: String,

    }
}, {
    timestamps: true,
});

// add plugin that converts mongoose to json
rangeSchema.plugin(toJSON);

const range = mongoose.model('range', rangeSchema);

module.exports = range;