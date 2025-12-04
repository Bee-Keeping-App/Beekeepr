const jwt = require("jsonwebtoken");

// constants from .env
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const ACCESS_EXPIRY = '15m';
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const REFRESH_EXPIRY = '7d';

exports.signAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
};

exports.signRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
};

exports.validateAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};

exports.validateRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};