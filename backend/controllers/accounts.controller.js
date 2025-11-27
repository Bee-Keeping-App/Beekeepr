const service = require("../services/accounts.service");


exports.getAll = async (req, res) => {
    const accounts = await service.findAll();
    res.json(accounts);
};

exports.getOne = async (req, res) => {
    const account = await service.findOne(req.params.id);
    res.json(account);
};

exports.insert = async (req, res) => {
    const account = await service.insertOne(req.body);
    res.status(201).json(account);
};

exports.update = async (req, res) => {
    const account = await accountService.updateOne(
        req.params.id,
        req.body
    );
  res.json(account);
}

exports.delete = async (req, res) => {
    await accountService.remove(req.params.id);
    res.status(204).send();
}