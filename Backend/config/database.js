const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Rohith_E:jcu-L:v4Bc8GWy!@Event_Manager.ekv0vib.mongodb.net/?retryWrites=true&w=majority&appName=Event_Manager', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        // process.exit(1);
    }
};

module.exports = connectDB;