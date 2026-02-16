import { UserModel, UserDocument } from './users.model';
import {
    User, UserSchema, 
    UserWithAuth, UserWithAuthSchema,
    CreateUserDTO, CreateUserSchema,
    UpdateUserDTO, UpdateUserSchema
 } from './users.schema';

import {
    NullQueryError
} from './../../classes/errors.class';


export const getUserById = async (id: string): Promise<User> => {
    
    const result = await UserModel
    .findById(id)   // looks for a document by its ID
    .lean();        // tells mongo to not wrap the result in a Mongoose object (very heavy) for a performance boost

    // TODO: uncomment this
    if (!result) throw new NullQueryError();

    // as User ensures the object only has fields the User object has
    return UserSchema.parse(result) as User;
};

export const getAllUsers = async (): Promise<Array<User>> => {

    const result = await UserModel
    .find()                     // empty find returns everything
    .lean();

    // TODO: uncomment this
    if (!result) throw new NullQueryError();

    // forces each element to be a user type
    return result.map((user: User) => { return UserSchema.parse(user); });
};

export const makeUser = async (data: CreateUserDTO): Promise<User> => {
    
    // executes pre-create functionality (password hashing)
    const doc = new UserModel(data);
    
    // does the actual insert
    await doc.save(); 
    
    // convert the document to a JSON
    const user = doc.toObject();
    
    // parse it
    return UserSchema.parse(user);
};

export const updateUser = async (data: UpdateUserDTO): Promise<User> => {

    // see if the user exists
    const alreadyExists = await UserModel.findOneAndUpdate(
        { email: data.email }
    ).lean();
    
    // ensures the user already exists
    if (!alreadyExists) throw new NullQueryError();

    // idempotent replace
    const result = await UserModel.findByIdAndUpdate(
        alreadyExists._id,                  // finds the doc by id
        { $set: data },                     // only updates fields defined in data
        { new: true, runValidators: true }  // replaces the old object, runs validation
    ).lean();

    return UserSchema.parse(result);
};