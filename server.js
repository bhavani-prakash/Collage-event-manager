const express = require('express');
const path = require('path');
const connectDB = require('./config/database');

const app = express();
const port = 3000;

// Connect to the database
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/events', require('./Routes/events'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});