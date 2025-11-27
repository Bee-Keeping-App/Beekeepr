const router = require("express").Router();
const auth = require('../middlewares/auth.middlewares');
const validate = require('../validation/accounts.validation');
const controller = require('../controllers/accounts.controller');

// always check for tokens
router.use(auth);

// get all users
router.get(
    "/",
    controller.getAll
);

// get one user
router.get(
    "/:id",
    validate.id,
    controller.getOne
);

