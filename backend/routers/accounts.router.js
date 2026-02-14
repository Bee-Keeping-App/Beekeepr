import { Router } from 'express';

/* middlewares do validation, authorization */
import validate from '../middlewares/validation.middleware.js';
import authenticate from '../middlewares/auth.middleware.js';

/* validator contains schemes for each endpoint, checked by middleware */
import * as schema from '../validators/accounts.validator.js';

/* controller calls logic for implementing actions upon successful auth / validation */
import * as controller from '../controllers/accounts.controller.js';

var router = Router();

/* Registering an account should not need prior authorization */
router.post(
    "/",
    validate(schema.create()),
    controller.registerAccount
);

// get all users
router.get(
    "/",
    authenticate,
    controller.getAllAccounts
);

// get one user
router.get(
    "/:id",
    authenticate,
    validate(schema.findOne()),
    controller.getOneAccount
);

// update an account
router.put(
    "/",
    authenticate,
    validate(schema.update()),
    controller.updateAccountInfo
);

// delete an account
router.delete(
    "/",
    authenticate,
    controller.deleteAccount
);

// this is how app.js accesses the account routes
export default router;