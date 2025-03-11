const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const password = process.env.PASSWORD;
        // console.log('Connecting with password:', password);

        await mongoose.connect(`mongodb+srv://Rohith_E:${encodeURIComponent(password)}@Event_Manager.ekv0vib.mongodb.net/?retryWrites=true&w=majority&appName=Event_Manager`, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true <----No effect since they are considered as default in latest version
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('DB connection failed ', err.message);
        // process.exit(1);
    }
};

module.exports = connectDB;