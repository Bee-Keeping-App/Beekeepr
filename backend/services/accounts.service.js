const Accounts = require('../models/accounts.model');
const argon2 = require('argon2');

exports.findAll = () => { 
    return Accounts.find(); 
};

exports.findOne = (query) => { 
    return Accounts.findOne(query);
};

exports.findOneById = (id) => {
    return Accounts.findById(id);
};

exports.insertOne = (account) => {
    return Accounts.create(account);
};

exports.updateOne = (id, account) => {
    return Accounts.findByIdAndUpdate(id, account, { new: true });
};

exports.deleteOne = (id) => {
    return Accounts.findByIdAndDelete(id);
};

exports.comparePasswords = async (username, attempt) => {
    const user = await Accounts.findOne({ user: username });
    if (!user) return false;

    const valid = await argon2.verify(user.password, attempt);
    return valid ? user : false;
};

exports.revokeToken = (id) => {
    return Accounts.findByIdAndUpdate(id, { token: null });
};

exports.updateToken = (id, token) => {
    return Accounts.findByIdAndUpdate(id, { token: token });
};