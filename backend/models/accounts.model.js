const mongoose = require('mongoose');

/* all mongo entries for Accounts will have this scheme */
const AccountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: Int32,
        required: false,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Accounts", AccountSchema);