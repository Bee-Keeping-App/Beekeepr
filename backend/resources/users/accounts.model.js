import mongoose from 'mongoose';
import argon2 from 'argon2';

import { WrongPasswordError } from '../../classes/errors.class.js';


/* What is a model?
    a model is like a database schema, but for mongoDB
    We use the mongoose library, which hooks into our mongo cluster
    It can query, add/delete/update, and validate queries before they execute
    Additionally, it can do some cool stuff, as you'll see below
*/

/* all mongo entries for Accounts will have this scheme */

// this schema will ensure all documents have similar state
const AccountSchema = new mongoose.Schema({
    
    email: {            // each argument specifies a rule the key must have
        type: String,   // datatype
        required: true, // if it needs to be in the document or if its optional
        unique: true,   // does not allow duplicate values for this key
        trim: true,     // removes trailing/leading whitespace
        lowercase: true // sets all characters to lowercase
    },
    phone: {
        type: Number,
        required: false,
        unique: true,
        sparse: true    // IMPORTANT: when using unique, it considers documents that don't have this key
    },                  // to have the kv pair as {k: undefined} which means multiple documents without this key
                        // will break the unique constraint (as multiple will have {k: undefined})
                        // sparse tells mongoose to only enforce the uniqueness constraint across documents where
                        // the key is defined
    password: {
        type: String,
        required: true,
        select: false   // IMPORTANT: tells mongoose to not return this key when this document is queried, unless explicitly stated.
                        // this ensures we don't share hashed passwords everywhere
    },
    refreshId: {        // for tracking a user's refresh token. Useful for revoking in the case of security breaches
        type: Number,
        required: true,
        select: false
    },
    accessId: {         // for tracking a user's access token. Useful for revoking in the case of security breaches
        type: Number,
        required: true,
        select: false
    }
});

AccountSchema.set('toJSON', { virtuals: true });
AccountSchema.set('toObject', { virtuals: true });

// One of the cool mongoose functionalities: attaching a function to a schema
// This one gives an easy way to validate a login attempt. 
AccountSchema.methods.validatePassword = async function(attempt) {
    try {
        return await argon2.verify(this.password, attempt); //
    } catch (error) {
        throw WrongPasswordError('Could not verify attempt');
    }
};

// A middleware function that calls validatePassword before insertion
AccountSchema.pre('save', async function(next) {

    // checks if the insert modifies the password key
    if (!this.isModified('password')) return next();
    
    // if it does, it replaces it with the hashed version
    this.password = await argon2.hash(this.password);
    next();
});

// Virtuals create a virtual alias for a key.
// In this example, _id is being replaced with id for easier accessing
AccountSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// exporting the schema
export default mongoose.model("Accounts", AccountSchema);