import router from 'express/Router';

/* Middlewares */
import validate from '../middlewares/validation.middleware';
import authenticate from '../middlewares/auth.middleware';
import * as controller from '../controllers/auth.controller';
import * as schema from '../validators/auth.validator.js';

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