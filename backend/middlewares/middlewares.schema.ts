import { z } from 'zod';


// defines the shape of an auth object
export interface AuthObject {
    accessString: string;
    refreshString: string;
};

// defines rules for the input object to be deemed parsable
export const AuthParserSchema = z.object({
    headers: z.object({
        authorization: z.string().startsWith('Bearer ', "Invalid Authorization header format")
    }),
    cookies: z.object({
        refreshString: z.string({ required_error: "Refresh token cookie missing" })
    })
})  // this transform function parses further
.transform((val): AuthObject => {
    // Extract access from headers
    const accessString = val.headers.authorization.split(' ')[1];
    
    // Extract refresh from cookies
    const refreshString = val.cookies.refreshString;

    return { accessString, refreshString };
});