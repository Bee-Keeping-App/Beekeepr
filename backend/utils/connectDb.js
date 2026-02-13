import mongoose from "mongoose";

export default async () => {
    const uri = (process.env.USE_PROD === 'true') ? process.env.MONGO_PROD : process.env.MONGO_TEST;
    await mongoose.connect(uri);
};