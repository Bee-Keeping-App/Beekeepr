import { z } from 'zod';

// this function maps a mongo _id to id
const withIdMapping = (data: any) => {
    if (data._id && !data.id) {
        const { _id, ...rest } = data;
        return { ...rest, id: _id.toString() };
    }
    return data;
};

// normal User schema
const UserBase = z.object({
    id: z.string(),
    phone: z.string().optional(),
    email: z.string().email(),
});

// userWithAuth schema
const AuthBase = UserBase.extend({
    password: z.string(),
    refreshId: z.number(),
    accessId: z.number(),
});

// actually defining the schemas here with the id mapping
export const UserSchema = UserBase.transform(withIdMapping);
export const UserWithAuthSchema = AuthBase.transform(withIdMapping);

// exporting their types
export type User = z.infer<typeof UserSchema>;
export type UserWithAuth = z.infer<typeof UserWithAuthSchema>;

// this is used for POST requests to make a new account
export const CreateUserSchema = z.object({
    email: z.string().email(),
    phone: z.string(),
    password: z.string().min(8),
});

// defines the CreateUserDTO type
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

// defines an Update schema, which is composed of a subset of CreateUserSchema fields
export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

export const GetUserSchema = z.object({ id: z.string() });
export type GetUserDTO = z.infer<typeof GetUserSchema>;