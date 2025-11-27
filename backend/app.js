const express = require('express');
const app = express();

/* Middlewares */
const loggingMiddleware = require('./middlewares/logging.middlewares');
const errorMiddleware = require('./middlewares/error.middlewares'); 

/* Implementing Middlewares */
app.use(express.json());
app.use(loggingMiddleware);

app.use('/accounts', require('./routes/accounts.routes'));

/* errorMiddleware MUST BE AT THE BOTTOM LIKE SO */
app.use(errorMiddleware);

module.exports = app;