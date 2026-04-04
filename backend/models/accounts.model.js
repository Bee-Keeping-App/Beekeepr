import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({

    clerkId: {
        type: String,
        required: true,
        unique: true,
        select: false
    },
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
    }
});

AccountSchema.set('toJSON', { virtuals: true });
AccountSchema.set('toObject', { virtuals: true });

AccountSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

export default mongoose.model("Accounts", AccountSchema);
