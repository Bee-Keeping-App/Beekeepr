import 'dotenv/config';
import app from './app.js';
import connectToDB from './utils/connectDb.js';

connectToDB().then(() => {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is live on ${PORT}`);
    });
});