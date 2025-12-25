const Accounts = require('../models/accounts.model');
const {
    NullQueryError,
    DuplicateFieldError
} = require('../classes/errors.class');


exports.findAll = async () => {
    const result = await Accounts.find();
    if (!result) throw new NullQueryError('Account(s) not found');
    return result;
};

exports.findOne = async (query, includePassword = false) => {
    const result = includePassword ? await Accounts.findOne(query, '+password') : await Accounts.findOne(query);
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

exports.findOneById = async (id, includeTokens = false) => {
    const result = includeTokens ? await Accounts.findById(id, '+refreshId +accessId') : await Accounts.findById(id);
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

exports.insertOne = async (account) => {

    try {
        return await Accounts.create(account);
    } catch(err) {
        if (err.code === 11000)
            throw new DuplicateFieldError('A unique index was violated by this insert');
        throw err;
    }
};

exports.updateOne = async (id, account) => {
    const result = await Accounts.findByIdAndUpdate(id, account, { new: true });
    if (!result) throw new NullQueryError('Account not found');
    return result;
};

exports.deleteOne = async (id) => {
    const result = await Accounts.findByIdAndDelete(id);
    if (!result) throw new NullQueryError('Account not found');
    return result;
};