const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true }, // Start date/time
    enddate: { type: Date, required: true },
    registrationdeadline: { type: Date },
    image: { type: String, required: true },
    registrationurl: { type: String, required: true },
    status: {
        type: String,
        enum: ['Upcoming !', 'Ongoing !', 'Completed !'],
        default: 'Upcoming !'
    },
    branch: {
        type: String,
        enum: ['CSE', 'ECE', 'AI', 'ML', 'CYBER', 'MECH', 'CIVIL', 'Others'],
        required: true
    },
    category: {
        type: String,
        enum: ['Academic', 'Department fest', 'Workshop'],
        required: true
    },
    type: {
        type: String,
        enum: ['technical', 'non-technical'],
        required: true
    },
    venue: { type: String },
    tickettype: {
        type: String,
        enum: ['Free', 'Paid'],
        required: true
    },
    ticketprice: { type: Number }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;