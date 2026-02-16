import { Request, Response, Router } from 'express';

import * as controller from './users.controller';

const router = Router();

router.get(
    "/",
    controller.getAllUsers
);

router.get(
    "/:id",
    controller.getOneById
);

router.post(
    "/",
    controller.getAllUsers
);

router.patch(
    "/",
    controller.updateOneUser
);