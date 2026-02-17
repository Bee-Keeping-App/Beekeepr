import { Request, Response, Router } from 'express';

import validate from './../../middlewares/validation.middleware';
import { GetUserSchema, CreateUserSchema, UpdateUserSchema } from './users.schema';
import * as controller from './users.controller';

const router = Router();

/* 
    In a Router file, we define endpoints with a path and a chain of functions
    the first line defines the supported HTTP method
    the second line defines the path
    the following lines define a series of functions to call. They are accessed sequentially using "next"
*/

router.get(                     // this route supports GET
    "/",                        // this route ends in /
    controller.getAllUsers      // after validation the controller is called
);

router.get(
    "/:id",                     // an example of a "path parameter"
    validate(GetUserSchema),    // sometimes a validation function will execute ahead of the controller
    controller.getOneById
);

router.post(
    "/",
    validate(CreateUserSchema),
    controller.createOneUser
);

router.patch(
    "/:id",
    validate(GetUserSchema),
    validate(UpdateUserSchema),
    controller.updateOneUser
);

router.delete(
    "/:id",
    validate(GetUserSchema),
    controller.deleteOneById
);

export default router;