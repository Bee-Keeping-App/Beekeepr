const auth = require('../services/auth.service');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // checks if token is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing auth token" });
    }

    // parses token
    const token = authHeader.split(" ")[1];

    try {
        
        // verify token
        const payload = auth.validateAccessToken(token);

        // ids each user's request
        req.user = payload;
        
        next();
    } catch (err) {
        // reject
        return res.status(401).json({ error: "Invalid token" });
    }
}; 