// setting up connection
const mongoose = require('mongoose');

// const to connect database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    // message at console that connection was made
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1); // exit failure
  }
};
// create module to run on app.js
module.exports = connectDB;
