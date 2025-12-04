const Accounts = require("../services/accounts.service");
const Auth = require('../services/auth.service');

/* Read all caller */
exports.getAllAccounts = async (req, res) => {
    const accounts = await Accounts.findAll();
    res.status(200).json({ accounts });
};

/* Read one caller */
exports.getOneAccount = async (req, res) => {
    const account = await Accounts.findOneById(req.params.id);
    res.status(200).json({ account });
};

/* Insert caller */
exports.registerAccount = async (req, res, next) => {
    
    try {
        // upload account to mongo
        const account = await Accounts.insertOne(req.body);
        
        // make tokens
        const refreshToken = Auth.signRefreshToken({ id: account._id.toString() });
        const accessToken = Auth.signAccessToken({ id: account._id.toString() });

        // update refresh tracker in mongo
        await Accounts.updateToken(account._id.toString(), refreshToken);

        // attach tokens
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: (process.env.USE_PROD == 'true') });
        return res.status(201).json({ 'token': accessToken });
    } catch(err) {
        next(err);
    }
};

/* Update caller */
exports.updateAccountInfo = async (req, res) => {
    const account = await Accounts.updateOne(
        req.user.id,
        req.body
    );

  res.status(200).json({ account });
}

/* Delete caller */
exports.deleteAccount = async (req, res) => {
    await Accounts.deleteOne(req.user.id);
    
    // removes the refresh token from the request
    res.cookie('refreshToken', '', { httpOnly: true, secure: (process.env.USE_PROD == 'true'), maxAge: 0 });
    
    res.status(204).send();
}