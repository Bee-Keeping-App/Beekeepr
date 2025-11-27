const mongoose = require("mongoose");

exports.connectToDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};