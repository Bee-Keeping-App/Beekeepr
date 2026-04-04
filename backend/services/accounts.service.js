import AccountSchema from '../models/accounts.model.js';
import {
    NullQueryError,
    DuplicateFieldError
} from '../classes/errors.class.js';

/* Gets every account */
export const findAll = async () => {
    const result = await AccountSchema.find();
    // find() never returns null, it's just an empty list
    return result;
};

/* Gets 1 account by query */
export const findOne = async (query) => {
    const result = await AccountSchema.findOne(query);
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

/* Gets one account by id */
export const findOneById = async (id) => {
    const result = await AccountSchema.findById(id);
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

/* Gets one account by Clerk user ID */
export const findOneByClerkId = async (clerkId) => {
    const result = await AccountSchema.findOne({ clerkId });
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

/* Creates one account. Throws a duplicate field error if schema is violated */
export const insertOne = async (account) => {
    try {
        return await AccountSchema.create(account);
    } catch(err) {
        if (err.code === 11000)
            throw new DuplicateFieldError('A unique index was violated by this insert');
        throw err;
    }
};

/* Updates an account by ID */
export const updateOne = async (id, account) => {
    const result = await AccountSchema.findByIdAndUpdate(id, account, { new: true });
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

/* Finds an account by id and deletes it */
export const deleteOne = async (id) => {
    const result = await AccountSchema.findByIdAndDelete(id);
    if (!result) throw new NullQueryError('Account not found');
    return result;
};
