const mongoose = require('mongoose');

/* all mongo entries for Accounts will have this scheme */
const AccountSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String
});

module.exports = mongoose.model("Account", AccountSchema);