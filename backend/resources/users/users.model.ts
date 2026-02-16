import { Schema, model, HydratedDocument } from 'mongoose';
import { UserWithAuth } from './users.schema';

// this type allows a User type to become a UserDocument
// and UserDocuments can become Documents
interface UserNoId extends Omit<UserWithAuth, 'id'> {};
export type UserDocument = HydratedDocument<UserNoId>;

/* all mongo entries for Users will have this scheme */

// this schema will ensure all documents have similar state
const userSchema = new Schema<UserNoId>({
    
    email: {            // each argument specifies a rule the key must have
        type: String,   // datatype
        required: true, // if it needs to be in the document or if its optional
        unique: true,   // does not allow duplicate values for this key
        trim: true,     // removes trailing/leading whitespace
        lowercase: true // sets all characters to lowercase
    },
    phone: {
        type: String,
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

// exports a model of type UserDocument, which can be coerced into types User or UserWithAuth
export const UserModel = model<UserDocument>('User', userSchema);
