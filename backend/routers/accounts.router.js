import router from "express/Router";

/* middlewares do validation, authorization */
import validate from '../middlewares/validation.middleware';
import authenticate from '../middlewares/auth.middleware';

/* validator contains schemes for each endpoint, checked by middleware */
import * as schema from '../validators/accounts.validator';

/* controller calls logic for implementing actions upon successful auth / validation */
import * as controller from '../controllers/accounts.controller';

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