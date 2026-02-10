const mongoose = require('mongoose');
const argon2 = require('argon2');
const {
    WrongPasswordError
} = require('../classes/errors.class');

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
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    refreshId: {
        type: Number,
        required: true,
        select: false
    },
    accessId: {
        type: Number,
        required: true,
        select: false
    }
});

AccountSchema.set('toJSON', { virtuals: true });
AccountSchema.set('toObject', { virtuals: true });

// call scheme.validatePassword to verify an attempt
AccountSchema.methods.validatePassword = async function(attempt) {
    try {
        return await argon2.verify(this.password, attempt);
    } catch (error) {
        throw WrongPasswordError('Could not verify attempt');
    }
};

// middleware for auto-hashing passwords
AccountSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await argon2.hash(this.password);
    next();
});

// rename _id to id
AccountSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

module.exports = mongoose.model("Accounts", AccountSchema);