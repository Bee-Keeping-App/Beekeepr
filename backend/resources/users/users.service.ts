import { UserModel, UserDocument, UserNoId } from './users.model';
import {
    User, UserSchema,
    CreateUserDTO, UpdateUserDTO,
 } from './users.schema';



export const getUserById = async (id: string): Promise<User> => {
    
    const result = await UserModel
    .findById(id)               // looks for a document by its ID
    .lean() as UserNoId | null; // tells mongo to not wrap the result in a Mongoose object (very heavy) for a performance boost
    
    // TODO: replace Error with a custom error
    if (!result) throw new Error('User with that id was not found');

    // as User ensures the object only has fields the User object has
    return UserSchema.parse(result);
};

export const getAllUsers = async (): Promise<User[]> => {

    const result = await UserModel
    .find()                     // empty find returns everything
    .lean() as UserNoId[];

    // TODO: uncomment this
    // Or don't
    // if (!result) throw new Error('No users found');

    // forces each element to be a user type
    return result.map((user: UserNoId) => { return UserSchema.parse(user); }) as User[];
};

export const makeUser = async (data: CreateUserDTO): Promise<User> => {
    
    // executes pre-create functionality (password hashing)
    const doc = new UserModel(data);
    
    // does the actual insert
    await doc.save();

    console.log(doc);
    
    // parse the document as POJO (JSON) 
    return UserSchema.parse(doc.toObject()) as User;
};

export const updateUser = async (data: UpdateUserDTO, id: string): Promise<User> => {

    // see if the user exists
    const result = await UserModel.findByIdAndUpdate(
        id,                                 // finds the doc by id
        { $set: data },                     // only updates fields defined in data
        { new: true, runValidators: true }  // replaces the old object, runs validation
    ).lean() as UserNoId;
    
    // ensures the user already exists
    if (!result) throw new Error('Could not find target user');

    // returns a User type
    return UserSchema.parse(result) as User;
};

export const deleteUser = async (id: string): Promise<void> => {
    
    // delete the user
    await UserModel.findByIdAndDelete(id);
};