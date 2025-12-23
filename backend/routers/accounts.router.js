const router = require("express").Router();

/* middlewares do validation, authorization */
const validate = require('../middlewares/validation.middleware');
const auth = require('../middlewares/auth.middleware');

/* validator contains schemes for each endpoint, checked by middleware */
const validator = require('../validators/accounts.validator');

/* controller calls logic for implementing actions upon successful auth / validation */
const controller = require('../controllers/accounts.controller');

/* Registering an account should not need prior authorization */
router.post(
    "/",
    validate(validator.create()),
    controller.registerAccount
);

/* WARNING: All routes after this line WILL CHECK FOR AUTH TOKENS */
router.use(auth);

// get all users
router.get(
    "/",
    controller.getAllAccounts
);

// get one user
router.get(
    "/:id",
    validate(validator.idParam()),
    controller.getOneAccount
);

// update an account
router.put(
    "/",
    validate(validator.update()),
    controller.updateAccountInfo
);

// delete an account
router.delete(
    "/",
    controller.deleteAccount
);

// this is how app.js accesses the account routes
module.exports = router;