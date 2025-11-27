const express = require('express');
const app = express();

/* Middlewares */
app.use(express.json());
app.use(require('./middlewares/logging.middlewares'));

/* routes implemented after this line WILL REQUIRE AUTH TOKENS */
app.use(require('./middlewares/auth.middlewares'));

app.use('/accounts', require('./routes/accounts.routes'));
app.use('/refresh', require("./routes/refresh.routes"));
app.use('/login', require("./routes/login.routes"));

module.exports = app;