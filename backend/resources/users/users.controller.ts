import { Request, Response } from 'express';

import * as Service from './users.service'; 
import { 
    User, GetUserSchema,
    CreateUserSchema, CreateUserDTO,
    UpdateUserSchema, UpdateUserDTO
} from './users.schema';

export const getOneById = async (req: Request, res: Response) => {
    
    // parses the id as a string
    const id: string | null = GetUserSchema.parse(req.params.id).id;
    if (!id) return res.status(400).json({"err": "missing id path parameter"});

    // gets the user object from the service
    const user: User = await Service.getUserById(id);
    
    // sends the safe version of a user
    return res.status(200).json(user);
};

export const getAllUsers = async (req: Request, res: Response) => {

    // call the service to get all the users
    const users: Array<User> = await Service.getAllUsers();
    
    // returns the users
    return res.status(200).json(users);
};

export const createOneUser = async (req: Request, res: Response) => {

    // parse the body into a CreateUserDTO
    const input: CreateUserDTO = CreateUserSchema.parse(req.body);
    
    // Service returns a User object
    const user: User = await Service.makeUser(input);
    
    // send back the made document
    return res.status(201).json(user);
};

export const updateOneUser = async (req: Request, res: Response) => {

    // parse the body into an UpdateUserDTO
    const input: UpdateUserDTO = UpdateUserSchema.parse(req.body);

    // Service returns the updated user info as a User type
    const user: User = await Service.updateUser(input);

    // send back the made document
    return res.status(200).json(user);
};

export const deleteOneUser = async (req: Request, res: Response) => {

    // parses the id as a string
    const id: string | null = GetUserSchema.parse(req.params.id).id;
    if (!id) return res.status(400).json({"err": "missing id path parameter"});

    // call the service
    await Service.deleteUser(id);

    // respond with success
    return res.status(204).json({"msg": "user deleted"});
};