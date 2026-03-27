import { Router } from 'express';

/* Middlewares */
import validate from '../middlewares/validation.middleware.js';
import authenticate from '../middlewares/auth.middleware.js';
import * as controller from '../controllers/auth.controller.js';
import * as schema from '../validators/auth.validator.js';

var router = Router();

/* Login route. It expects a body with login credentials, will validate, then verify with the controller */
router.post(
    "/login",
    validate(schema.login()),
    controller.login
);

/* Token refresh route. It is missing a validation call to check for a refresh token */
router.post(
    "/refresh",
    controller.refreshToken
);

/* Logout route. It checks for tokens, then calls logout, which revokes them */
router.post(
    "/logout",
    authenticate,
    controller.logout
);

// this is how app.js accesses the auth routes
export default router;