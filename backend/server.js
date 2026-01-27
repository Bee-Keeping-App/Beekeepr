require('dotenv').config();
const app = require('./app');
const { connectToDB } = require('./utils/connectDb');

connectToDB().then(() => {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is live on ${PORT}`);
    });
});