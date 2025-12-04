const Accounts = require('../models/accounts.model');
const argon2 = require('argon2');

class DuplicateUserError extends Error {}
class NotFoundError extends Error {}

exports.DuplicateUserError = DuplicateUserError;
exports.NotFoundError = NotFoundError;

exports.findAll = async () => { 
    return await Accounts.find(); 
};

exports.findOne = async (query) => { 
    return await Accounts.findOne(query);
};

exports.findOneById = async (id) => {
    return await Accounts.findById(id);
};

exports.insertOne = async (account) => {

    try {
        return await Accounts.create(account);
    } catch(err) {
        if (err.code === 11000) {
            throw new DuplicateUserError('Email already exists');
        }
        throw err;
    }
};

exports.updateOne = async (id, account) => {
    const result = await Accounts.findByIdAndUpdate(id, account, { new: true });
    if (!result) {
        throw new NotFoundError('Account not found');
    }
    return result;
};

exports.deleteOne = async (id) => {
    const result = await Accounts.findByIdAndDelete(id);
    if (!result) {
        throw new NotFoundError('Account not found');
    }
    return result;
};

exports.comparePasswords = async (username, attempt) => {
    const user = await Accounts.findOne({ user: username });
    if (!user) return false;

    const valid = await argon2.verify(user.password, attempt);
    return valid ? user : false;
};

exports.revokeToken = async (id) => {
    const result = await Accounts.findByIdAndUpdate(id, { token: null });
    if (!result) {
        throw new NotFoundError('Account not found');
    }
    return result;
};

exports.updateToken = async (id, token) => {
    const result = await Accounts.findByIdAndUpdate(id, { token: token });
    if (!result) {
        throw new NotFoundError('Account not found');
    }
    return result;
};