const Accounts = require('../models/accounts.model');

exports.findAll = async () => {
    return Accounts.find();
};

exports.findOne = async (id) => {
    return Accounts.findById(id);
};

exports.insertOne = async (account) => {
    return Accounts.create(account);
};

exports.updateOne = async (id, account) => {
    return Accounts.findByIdAndUpdate(id, account, { new: true });
};

exports.deleteOne = async (id) => {
    return Accounts.findByIdAndDelete(id);
};