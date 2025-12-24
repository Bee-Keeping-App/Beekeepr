const mongoose = require('mongoose');
const argon2 = require('argon2');

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
        required: true,
        select: false
    },
    refreshId: {
        type: Number,
        required: false,
        select: false
    },
    accessId: {
        type: Number,
        required: false,
        select: false
    }
});

AccountSchema.set('toJSON', { virtuals: true });
AccountSchema.set('toObject', { virtuals: true });

// call scheme.validatePassword to verify an attempt
AccountSchema.methods.validatePassword = async function(attempt) {
    console.log('validation args:', [attempt, this.password]);
    return await argon2.verify(this.password, attempt);
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