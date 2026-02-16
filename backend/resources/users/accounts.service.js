import AccountSchema from './accounts.model.js';
import {
    NullQueryError,
    DuplicateFieldError
} from '../../classes/errors.class.js';


/* Gets every account. Can throw a NullQuery error if no accounts were found */
export const findAll = async () => {
    const result = await AccountSchema.find();  // no args ==> find everything
    if (!result) throw new NullQueryError('Account(s) not found');
    return result;
};

/* gets 1 account. Has a flag for returning the password or not */
export const findOne = async (query, includePassword = false) => {
    const result = includePassword ? await AccountSchema.findOne(query, '+password') : await AccountSchema.findOne(query);
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

/* gets one account by id. Has a flag for returning tokens or not */
export const findOneById = async (id, includeTokens = false) => {
    const result = includeTokens ? await AccountSchema.findById(id, '+refreshId +accessId') : await AccountSchema.findById(id);
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

// updates an account by ID to the arguments in account
export const updateOne = async (id, account) => {
    const result = await AccountSchema.findByIdAndUpdate(id, account, { new: true });
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

// finds an account by id and then deletes it
export const deleteOne = async (id) => {
    const result = await AccountSchema.findByIdAndDelete(id);
    if (!result) throw new NullQueryError('Account not found');
    return result;
};