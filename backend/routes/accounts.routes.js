const router = require("express").Router();

const validate = require('../middlewares/validation.middlewares');
const authorize = require('../middlewares/auth.middlewares');
const validator = require('../validation/accounts.validation');

const controller = require('../controllers/accounts.controller');

/* Registering an account should not need prior authorization */
router.post(
    "/",
    validate(validator.create),
    controller.insert
);

/* WARNING: All routes after this line MUST ACCEPT AUTH TOKENS */
router.use(authorize);

// get all users
router.get(
    "/",
    controller.getAll
);

// get one user
router.get(
    "/:id",
    validate(validator.idParam),
    controller.getOne
);

// update an account
router.patch(
    validate(validator.update),
    controller.update
);

// delete an account
router.delete(
    "/:id",
    validate(validator.id),
    controller.delete
);

// this is how app.js accesses the account routes
module.exports = router;