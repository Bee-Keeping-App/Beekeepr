const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String
});

module.exports = mongoose.model("Account", AccountSchema);