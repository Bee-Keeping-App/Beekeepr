const router = require('express').Router();

const validate = require('../middlewares/validation.middlewares');

const validator = require('../validation/auth.validation.js');

const controller = require('../controllers/auth.controller');


router.post(
    "/refresh",
    validate(validator.hasRefreshToken()),
    controller.refreshToken
);

router.post(
    "/login",
    validate(validator.login()),
    controller.login
);

router.post(
    "/logout",
    controller.logout
);