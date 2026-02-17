import express from 'express';
import cookieParser from "cookie-parser";
const app = express();

/* Middlewares */
import logger from './middlewares/logging.middleware';
import errorHandler from './middlewares/error.middleware';

/* Routers */
import usersRouter from './resources/users/users.router';

/* Imported Middlewares */
app.use(express.json());
app.use(cookieParser());

/* Custom Middlewares */
app.use(logger);

/* Implementing Routes */
app.use('/api/users', usersRouter);

/* errorMiddleware MUST BE AT THE BOTTOM LIKE SO */
app.use(errorHandler);

export default app;