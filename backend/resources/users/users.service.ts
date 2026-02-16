import { UserModel, UserDocument } from './users.model';
import {
    User, UserSchema, 
    UserWithAuth, UserWithAuthSchema
 } from './users.schema';

export const getUserById = async (id: string): Promise<User> => {
    
    const result = await UserModel
    .findById(id)   // looks for a document by its ID
    .lean();        // tells mongo to not wrap the result in a Mongoose object (very heavy) for a performance boost

    // TODO: uncomment this
    /* if (!result) throw new NullQueryError(); */

    // as User ensures the object only has fields the User object has
    return UserSchema.parse(result) as User;
};

export const getAllUsers = async (): Promise<Array<User>> => {

    const result = await UserModel
    .find()                     // empty find returns everything
    .lean();

    // TODO: uncomment this
    /* if (!result) throw new NullQueryError(); */

    // forces each element to be a user type
    return result.map((user: User) => { return UserSchema.parse(user); });
};