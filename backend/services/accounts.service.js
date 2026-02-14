import AccountSchema from '../models/accounts.model.js';
import {
    NullQueryError,
    DuplicateFieldError
} from '../classes/errors.class.js';



export const findAll = async () => {
    const result = await AccountSchema.find();
    if (!result) throw new NullQueryError('Account(s) not found');
    return result;
};

export const findOne = async (query, includePassword = false) => {
    const result = includePassword ? await AccountSchema.findOne(query, '+password') : await AccountSchema.findOne(query);
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

export const findOneById = async (id, includeTokens = false) => {
    const result = includeTokens ? await AccountSchema.findById(id, '+refreshId +accessId') : await AccountSchema.findById(id);
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

export const insertOne = async (account) => {

    try {
        return await AccountSchema.create(account);
    } catch(err) {
        if (err.code === 11000)
            throw new DuplicateFieldError('A unique index was violated by this insert');
        throw err;
    }
};

export const updateOne = async (id, account) => {
    const result = await AccountSchema.findByIdAndUpdate(id, account, { new: true });
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

export const deleteOne = async (id) => {
    const result = await AccountSchema.findByIdAndDelete(id);
    if (!result) throw new NullQueryError('Account not found');
    return result;
};