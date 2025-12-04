module.exports = (err, req, res, next) => {
    console.error("ERROR:", err);   // logs full stack trace

    res.status(err.status || 500).json({
        error: err.message || "Internal server error"
    });
};