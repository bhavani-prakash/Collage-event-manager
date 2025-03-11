const express = require('express');
const path = require('path');
const connectDB = require('./Backend/config/database');
const eventRoutes = require('./Backend/routes/events');
const isAdmin = require('./Backend/middleware/authMiddleware');

const app = express();
const port = 3000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'Frontend')));

// Routes
app.use('/api/events', eventRoutes);

// Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// Serve create-event.html
app.get('/admin', isAdmin, (req, res) => {
    const filePath = path.join(__dirname, 'Frontend', 'create-event.html');
    // console.log(`Serving file from: ${filePath}`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving file:', err);
            res.status(404).send('File not found');
        }
    });
});

// Handle form submission
app.post('/api/events', async (req, res) => {
    try {
        const { title, description, date, image, registrationurl, status, branch, type } = req.body;
        // Save the event data to the database
        // Replace with actual database save logic
        const newEvent = { title, description, date, image, registrationurl, status, branch, type };
        console.log('Event data:', newEvent);
        // Assuming you have a model named Event
        // await Event.create(newEvent);
        res.status(201).send('Event created successfully');
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send('Failed to create event');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});