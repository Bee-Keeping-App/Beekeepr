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
        type: Number,
        required: false,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false,
        sparse: true
    }
});

module.exports = mongoose.model("Accounts", AccountSchema);