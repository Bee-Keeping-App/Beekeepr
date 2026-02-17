import { z } from 'zod';

// defines what goes into a token payload
export const TokenPayloadSchema = z.object({
    owner: z.string(),
    iat: z.date(),
    version: z.number()
});

// infers a type for a token payload based off the zod object
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;