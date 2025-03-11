const express = require('express');
const path = require('path');
const connectDB = require('./Backend/config/database');
const eventRoutes = require('./Backend/routes/events');
const static = require('./Frontend/static')

const app = express();
const port = 3000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, static)));

// Routes
app.use('/api/events', eventRoutes);

// Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});