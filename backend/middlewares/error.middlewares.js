const { DuplicateUserError, NotFoundError } = require('../services/accounts.service');

module.exports = (err, req, res, next) => {

    if (err instanceof DuplicateUserError) {
        return res.status(409).json({ error: err.message });
    }

    if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
    }

    console.error("ERROR:", err);   // logs full stack trace
    res.status(err.status || 500).json({
        error: err.message || "Internal server error"
    });
};