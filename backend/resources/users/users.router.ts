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
    validate(GetUserSchema),    // the first function in the chain is a validation
    controller.getAllUsers      // after validation the controller is called
);

router.get(
    "/:id",                     // an example of a "path parameter"
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

router.delete(
    "/",
    validate(GetUserSchema),
    controller.
)

export default router;