import express from 'express';
import { clerkMiddleware } from '@clerk/express';
const app = express();

/* Middlewares */
import logger from './middlewares/logging.middleware.js';
import errorHandler from './middlewares/error.middleware.js';

/* Routers */
import accountsRouter from './routers/accounts.router.js';
import weatherRouter from './routers/weather.router.js';

/* Imported Middlewares */
app.use(express.json());
app.use(clerkMiddleware());

/* Custom Middlewares */
app.use(logger);

/* Implementing Routes */
app.use('/api/accounts', accountsRouter);
app.use('/api/weather', weatherRouter);

/* errorMiddleware MUST BE AT THE BOTTOM LIKE SO */
app.use(errorHandler);

export default app;
