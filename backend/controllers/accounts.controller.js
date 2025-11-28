const Accounts = require("../services/accounts.service");
const Auth = require('../services/auth.service');

/* Read all caller */
exports.getAllAccounts = async (req, res) => {
    const accounts = await Accounts.findAll();
    res.json({ accounts });
};

/* Read one caller */
exports.getOneAccount = async (req, res) => {
    const account = await Accounts.findOne(req.params.id);
    res.json({ account });
};

/* Insert caller */
exports.registerAccount = async (req, res) => {
    
    // upload account to mongo
    const account = await Accounts.insertOne(req.body);
    
    // make tokens
    const refreshToken = Auth.signRefreshToken({ id: account._id.toString() });
    const accessToken = Auth.signAccessToken({ id: account._id.toString() });

    // attach tokens
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: (process.env.USE_PROD == 'true') });
    return res.status(200).json({ accessToken });
};

/* Update caller */
exports.updateAccountInfo = async (req, res) => {
    const account = await Accounts.updateOne(
        req.params.id,
        req.body
    );

  res.json({ account });
}

/* Delete caller */
exports.deleteAccount = async (req, res) => {
    await Accounts.remove(req.params.id);
    res.status(204).send();
}