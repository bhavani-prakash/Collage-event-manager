const express = require('express');
const path = require('path');
const connectDB = require('./Backend/config/database');
const eventRoutes = require('./Backend/routes/events');
const authRoutes = require('./Backend/routes/auth');
const isAdmin = require('./Backend/middleware/authMiddleware');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'Frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'Backend/uploads')));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);

// Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// Serve /admin login/register page (use only /admin for admin-login.html)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'admin-login.html'));
});

// Serve create-event.html only for admins (protected)
app.get('/admin/create', isAdmin, (req, res) => {
    const filePath = path.join(__dirname, 'Frontend', 'create-event.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving file:', err);
            res.status(404).send('File not found');
        }
    });
});

// Serve admin event management page (list, edit, delete)
app.get('/admin/events', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'manage.html'));
});

// Serve user login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'login.html'));
});

// Serve user registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'register.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});