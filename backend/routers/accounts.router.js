import { Router } from 'express';
import { requireAuth } from '@clerk/express';

/* middlewares do validation */
import validate from '../middlewares/validation.middleware.js';

/* validator contains schemes for each endpoint, checked by middleware */
import * as schema from '../validators/accounts.validator.js';

/* controller calls logic for implementing actions upon successful auth / validation */
import * as controller from '../controllers/accounts.controller.js';

var router = Router();

/* Account registration path. Requires Clerk auth, validates fields, then calls the controller. */
router.post(
    "/",
    requireAuth(),
    validate(schema.create()),
    controller.registerAccount
);

/* Account GET ALL path. Requires auth, then calls the controller method for reading all accounts */
router.get(
    "/",
    requireAuth(),
    controller.getAllAccounts
);

/* Account GET one path. Expects an account id param, requires auth, validates args, then calls the controller */
router.get(
    "/:id",
    requireAuth(),
    validate(schema.findOne()),
    controller.getOneAccount
);

/* Account PUT path. Requires auth, validates fields, then calls the controller to update */
router.put(
    "/",
    requireAuth(),
    validate(schema.update()),
    controller.updateAccountInfo
);

/* Account DELETE path. Requires auth, then deletes that account with the controller */
router.delete(
    "/",
    requireAuth(),
    controller.deleteAccount
);

export default router;
