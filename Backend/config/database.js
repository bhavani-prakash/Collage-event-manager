const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('your_mongodb_connection_string_here', {
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