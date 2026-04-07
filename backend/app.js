import express from 'express';
import cookieParser from "cookie-parser";
const app = express();

/* Middlewares */
import logger from './middlewares/logging.middleware.js';
import errorHandler from './middlewares/error.middleware.js'; 

/* Routers */
import accountsRouter from './routers/accounts.router.js';
import authRouter from './routers/auth.router.js';
import weatherRouter from './routers/weather.router.js';

import cors from 'cors';


app.use(cors({
    origin: ['http://localhost:8081'],
    credentials: true,
}))

/* Imported Middlewares */
app.use(express.json());
app.use(cookieParser());

/* Custom Middlewares */
app.use(logger);

/* Implementing Routes */
app.use('/api/accounts', accountsRouter);
app.use('/api/auth', authRouter);
app.use('/api/weather', weatherRouter);

/* errorMiddleware MUST BE AT THE BOTTOM LIKE SO */
app.use(errorHandler);

export default app;