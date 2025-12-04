const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();

/* Middlewares */
const loggingMiddleware = require('./middlewares/logging.middlewares');
const errorMiddleware = require('./middlewares/error.middlewares'); 

/* Imported Middlewares */
app.use(express.json());
app.use(cookieParser());

/* Custom Middlewares */
app.use(loggingMiddleware);

/* Implementing Routes */
app.use('/api/accounts', require('./routes/accounts.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
/* errorMiddleware MUST BE AT THE BOTTOM LIKE SO */
app.use(errorMiddleware);

module.exports = app;