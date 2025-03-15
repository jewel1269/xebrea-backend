const mongoose = require("mongoose");
  
const ConnectDb = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = ConnectDb;
