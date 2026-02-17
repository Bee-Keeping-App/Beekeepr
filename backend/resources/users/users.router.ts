import { Request, Response, Router } from 'express';

import validate from './../../middlewares/validation.middleware';
import { GetUserSchema, CreateUserSchema, UpdateUserSchema } from './users.schema';
import * as controller from './users.controller';

const router = Router();

router.get(
    "/",
    validate(GetUserSchema),
    controller.getAllUsers
);

router.get(
    "/:id",
    validate(GetUserSchema),
    controller.getOneById
);

router.post(
    "/",
    validate(CreateUserSchema),
    controller.getAllUsers
);

router.patch(
    "/",
    validate(UpdateUserSchema),
    controller.updateOneUser
);

export default router;