import { z } from 'zod';

// this function maps a mongo _id to id
// this is used when parsing any UserDocument type into a User type
const withIdMapping = (data: any) => {
    if (data._id && !data.id) {
        const { _id, ...rest } = data;
        return { ...rest, id: _id.toString() };
    }
    return data;
};

// normal User schema
// you can add extra identifiers to limit things / enforce regexes
const UserBase = z.object({
    id: z.string(),
    phone: z.string().optional(),
    email: z.string().email(),
});

// userWithAuth schema
// probably need to restrict password more
const AuthBase = UserBase.extend({
    password: z.string(),
    refreshId: z.number(),
    accessId: z.number(),
});

// actually defining the schemas here with the id mapping
export const UserSchema = UserBase.transform(withIdMapping);
export const UserWithAuthSchema = AuthBase.transform(withIdMapping);

// For consistency's sake, we build the types from the Zod schema definition
export type User = z.infer<typeof UserSchema>;
export type UserWithAuth = z.infer<typeof UserWithAuthSchema>;

// this is used for POST requests to make a new account
// these are the three things an account should have
export const CreateUserSchema = z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8),
});

// defines the CreateUserDTO type
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

// defines an Update schema, which is composed of a subset of CreateUserSchema fields
// this is useful for updating a subset of fields
export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

// this type is used purely for parsing an id for identifying a user
export const GetUserSchema = z.object({ id: z.string() });
export type GetUserDTO = z.infer<typeof GetUserSchema>;