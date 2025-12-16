const Event = require('../models/event');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    // Allow updates from either multipart/form-data (with possible file)
    // or from a regular request (no file). Only change fields that are provided
    // in the request so required fields are not accidentally cleared.
    const isMultipart = req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data');

    const processUpdate = async () => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) return res.status(404).json({ message: 'Event not found' });

            // If a new poster is uploaded, delete the old one and set the new path
            if (req.file) {
                if (event.image && event.image.startsWith('/uploads/')) {
                    const oldPath = path.join(__dirname, '..', event.image);
                    fs.unlink(oldPath, (err) => {
                        if (err) console.warn('Failed to delete old poster:', err.message);
                    });
                }
                event.image = `/uploads/${req.file.filename}`;
            }

            // Helper: set field only when present in request body
            const setIfPresent = (field, transform) => {
                if (typeof req.body[field] !== 'undefined' && req.body[field] !== '') {
                    event[field] = transform ? transform(req.body[field]) : req.body[field];
                }
            };

            setIfPresent('title');
            setIfPresent('description');
            setIfPresent('date', v => v);
            setIfPresent('enddate', v => v);
            setIfPresent('registrationdeadline', v => v);
            setIfPresent('registrationurl');
            setIfPresent('status');
            setIfPresent('branch');
            setIfPresent('category');
            setIfPresent('type');
            setIfPresent('venue');
            setIfPresent('tickettype');
            if (typeof req.body.ticketprice !== 'undefined' && req.body.ticketprice !== '') {
                event.ticketprice = Number(req.body.ticketprice);
            }

            await event.save();
            res.json(event);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    };

    if (isMultipart) {
        upload(req, res, async (err) => {
            if (err) {
                console.error('Multer error:', err);
                return res.status(400).json({ message: err.message });
            }
            await processUpdate();
        });
    } else {
        await processUpdate();
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