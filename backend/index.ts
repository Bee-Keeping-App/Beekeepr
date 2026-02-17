import 'dotenv/config';
import app from './app';
import connectToDB from './utils/connectDb.js';

// connects to the database before launching the server
connectToDB().then(() => {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is live on ${PORT}`);
    });
});