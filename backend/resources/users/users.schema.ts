import { z } from 'zod';

// schema that defines the base User object
export const UserSchema = z.object({
    id: z.string(),
    phone: z.string(),
    email: z.string().email(),
}).transform((data: any) => {
    // If we have _id but no id, map it
    if (data._id && !data.id) {
        return {
        ...data,
        id: data._id.toString(),
        };
    }
    return data;
});

// ensures the UserWithAuthSchema inherits the transform
export const UserWithAuthSchema = UserSchema.pipe(
    z.object({
        password: z.string(),
        refreshId: z.number(),
        accessId: z.number(),
    })
);

export type User = z.infer<typeof UserSchema>;
export type UserWithAuth = z.infer<typeof UserWithAuthSchema>;