import mongoose from "mongoose";

// parses the connection string then connects via mongoose
export default async () => {
    const uri = (process.env.USE_PROD === 'true') ? process.env.MONGO_PROD : process.env.MONGO_TEST;
    console.log("URI: ", uri)
    await mongoose.connect(uri);
};