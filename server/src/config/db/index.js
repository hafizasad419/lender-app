import mongoose from "mongoose";
import { MONGO_DB_URI } from "../index.js";

export const connectToMongoDB = async () => {
    try {
        const connectionInstance =
            await mongoose.connect(`${MONGO_DB_URI}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}
