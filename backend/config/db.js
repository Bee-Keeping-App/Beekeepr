const mongoose = require("mongoose");

exports.connectToDB = async () => {
    const uri = process.env.USE_PROD ? process.env.MONGO_PROD : process.env.MONGO_TEST;
    await mongoose.connect(uri);
};