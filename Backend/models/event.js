const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming'
    },
    category: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'Others'],
        required: true
    },
    type: {
        type: String,
        enum: ['Technical', 'Non-Technical'],
        required: true
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;