const jwt = require("jsonwebtoken");

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
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // reject
        return res.status(401).json({ error: "Invalid token" });
    }
};