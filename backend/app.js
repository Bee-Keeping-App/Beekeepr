import express from 'express';
import cookieParser from "cookie-parser";
const app = express();

/* Middlewares */
import logger from './middlewares/logging.middleware.js';
import errorHandler from './middlewares/error.middleware.js'; 

/* Routers */
import accountsRouter from './resources/users/accounts.router.js';
import authRouter from './resources/auth/auth.router.js';

/* Imported Middlewares */
app.use(express.json());
app.use(cookieParser());

/* Custom Middlewares */
app.use(logger);

/* Implementing Routes */
app.use('/api/accounts', accountsRouter);
app.use('/api/auth', authRouter);

/* errorMiddleware MUST BE AT THE BOTTOM LIKE SO */
app.use(errorHandler);

export default app;