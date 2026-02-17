import mongoose from "mongoose";

// parses the connection string then connects via mongoose
export default async () => {
    const uri: string = (process.env.USE_PROD === 'true') ? process.env.MONGO_PROD : process.env.MONGO_TEST;
    await mongoose.connect(uri);
};