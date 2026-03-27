import { Router } from 'express';

/* middlewares do validation, authorization */
import validate from '../middlewares/validation.middleware.js';
import authenticate from '../middlewares/auth.middleware.js';

/* validator contains schemes for each endpoint, checked by middleware */
import * as schema from '../validators/accounts.validator.js';

/* controller calls logic for implementing actions upon successful auth / validation */
import * as controller from '../controllers/accounts.controller.js';

// router object will hold the routes, and gets passed into the app.use() call
var router = Router();

/* Account registration path. It validates fields then calls the controller. It doesn't check auth */
router.post(
    "/",
    validate(schema.create()),
    controller.registerAccount
);

/* Account GET ALL path. It checks for auth, then calls the controller method for reading all accounts */
router.get(
    "/",
    authenticate,
    controller.getAllAccounts
);

/* Account GET one path. It expects an account id param, checks tokens, validates args, then calls the controller */
router.get(
    "/:id",
    authenticate,
    validate(schema.findOne()),
    controller.getOneAccount
);

/* Account PUT path. It checks tokens, parses id, validates fields, then calls the controller to update */
// This operation is IDEMPOTENT, which means if you call it multiple times the resource will always be the same on the server
router.put(
    "/",
    authenticate,
    validate(schema.update()),
    controller.updateAccountInfo
);

/* Account DELETE path. It checks tokens, parses id, then deletes that account with the controller */
router.delete(
    "/",
    authenticate,
    controller.deleteAccount
);

// this is how app.js accesses the account routes
export default router;