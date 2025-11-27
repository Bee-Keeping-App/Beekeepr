require('dotenv').config();
const app = require('./app');
const { connectToDB } = require('./config/db');

connectToDB().then(() => { 
    const PORT = process.env.USE_PROD ? process.env.PROD_URL : 3000
    app.listen(PORT, () => {
        console.log(`Server is live on ${PORT}`);
    });
});