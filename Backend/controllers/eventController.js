const Event = require('../models/event');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Backend/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('image');

// Get all events (with optional department filter)
const getAllEvents = async (req, res) => {
    try {
        const filter = {};
        if (req.query.department && req.query.department !== 'all') {
            // Map filter value to branch field in DB
            const departmentMap = {
                cse: 'CSE',
                ece: 'ECE',
                eee: 'EEE',
                mech: 'MECH',
                civil: 'CIVIL',
                ai: 'AI',
                ml: 'ML',
                cyber: 'CYBER',
                others: 'Others'
            };
            const branch = departmentMap[req.query.department.toLowerCase()];
            if (branch) filter.branch = branch;
        }
        const events = await Event.find(filter);
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new event
const createEvent = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: err.message });
        }

        // Parse ticketprice as number
        let ticketprice = req.body.ticketprice;
        if (ticketprice) ticketprice = Number(ticketprice);

        const event = new Event({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            enddate: req.body.enddate,
            registrationdeadline: req.body.registrationdeadline,
            image: req.file ? `/uploads/${req.file.filename}` : '',
            registrationurl: req.body.registrationurl,
            status: req.body.status,
            branch: req.body.branch,
            category: req.body.category,
            type: req.body.type,
            venue: req.body.venue,
            tickettype: req.body.tickettype,
            ticketprice: ticketprice
        });

        try {
            const newEvent = await event.save();
            res.status(201).json(newEvent);
        } catch (err) {
            console.error('Error saving event:', err);
            res.status(400).json({ message: err.message });
        }
    });
};

// Update an event
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};