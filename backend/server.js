require('dotenv').config();
const app = require('./app');
const { connectToDB } = require('./config/db');

connectToDB().then(() => {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is live on ${PORT}`);
    });
});