const router = require('express').Router();

/* Middlewares */
const validationMiddleware = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const controller = require('../controllers/auth.controller');
const validator = require('../validators/auth.validator.js');

router.post(
    "/login",
    validationMiddleware(validator.login()),
    controller.login
);

router.post(
    "/refresh",
    controller.refreshToken
);

// All endpoints past this line implement auth checking
router.use(authMiddleware);

router.post(
    "/logout",
    controller.logout
);

// this is how app.js accesses the auth routes
module.exports = router;