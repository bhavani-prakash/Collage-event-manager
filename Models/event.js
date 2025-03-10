const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    category: { type: String, required: true },
    eventType: { type: String, required: true },
    venue: { type: String, required: true },
    ticketType: { type: String, required: true },
    price: { type: Number, required: true },
    detailsLink: { type: String, required: true }
});

module.exports = mongoose.model('Event', eventSchema);