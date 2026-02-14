import { Router } from 'express';

/* Middlewares */
import validate from '../middlewares/validation.middleware.js';
import authenticate from '../middlewares/auth.middleware.js';
import * as controller from '../controllers/auth.controller.js';
import * as schema from '../validators/auth.validator.js';

var router = Router();

router.post(
    "/login",
    validate(schema.login()),
    controller.login
);

router.post(
    "/refresh",
    controller.refreshToken
);

router.post(
    "/logout",
    authenticate,
    controller.logout
);

// this is how app.js accesses the auth routes
export default router;