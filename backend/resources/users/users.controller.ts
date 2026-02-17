import { Request, Response } from 'express';

import * as Service from './users.service'; 
import { 
    User, GetUserSchema,
    CreateUserSchema, CreateUserDTO,
    UpdateUserSchema, UpdateUserDTO
} from './users.schema';
import catchAsync from '../../utils/catchAsync';


// this controller is used to get one user by their id
// the id is passed as a path parameter
export const getOneById = catchAsync(async (req: Request, res: Response) => {
    
    // parses the id as a string
    const { id } = GetUserSchema.parse(req.params);

    // gets the user object from the service
    const user: User = await Service.getUserById(id);
    
    // sends the safe version of a user
    return res.status(200).json(user);
});


// this controller function gets every user in the collection 
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {

    // call the service to get all the users
    const users: Array<User> = await Service.getAllUsers();
    
    // returns the users
    return res.status(200).json(users);
});


// this controller function makes a user
export const createOneUser = catchAsync(async (req: Request, res: Response) => {

    // parse the body into a CreateUserDTO
    const input: CreateUserDTO = CreateUserSchema.parse(req.body);
    
    // Service returns a User object
    const user: User = await Service.makeUser(input);
    
    // send back the made document
    return res.status(201).json(user);
});


// this controller function updates one user
export const updateOneUser = catchAsync(async (req: Request, res: Response) => {

    // parse the body into an UpdateUserDTO
    const input: UpdateUserDTO = UpdateUserSchema.parse(req.body);

    // parses the id as a string
    const { id } = GetUserSchema.parse(req.params);

    // Service returns the updated user info as a User type
    const user: User = await Service.updateUser(input, id);

    // send back the made document
    return res.status(200).json(user);
});


// this controller function deletes one user
export const deleteOneById = catchAsync(async (req: Request, res: Response) => {

    // parses the id as a string
    const { id } = GetUserSchema.parse(req.params);

    // call the service
    await Service.deleteUser(id);

    // respond with success
    return res.status(204).json({"msg": "user deleted"});
});