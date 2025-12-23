const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();

/* Middlewares */
const loggingMiddleware = require('./middlewares/logging.middleware');
const errorMiddleware = require('./middlewares/error.middleware'); 

/* Imported Middlewares */
app.use(express.json());
app.use(cookieParser());

/* Custom Middlewares */
app.use(loggingMiddleware);

/* Implementing Routes */
app.use('/api/accounts', require('./routers/accounts.router'));
app.use('/api/auth', require('./routers/auth.router'));

/* errorMiddleware MUST BE AT THE BOTTOM LIKE SO */
app.use(errorMiddleware);

module.exports = app;