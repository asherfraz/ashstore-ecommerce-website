import mongoose from "mongoose";
import { MONGODB_CONNECTION_STRING } from "./config/dotenvx";

export default async function connectToDatabase() {
    if (!MONGODB_CONNECTION_STRING) {
        throw new Error("MONGODB_CONNECTION_STRING is not defined");
    }
    await mongoose.connect(MONGODB_CONNECTION_STRING, {
    })
        .then(() => {
            console.log('Connected to MongoDB successfully: ', MONGODB_CONNECTION_STRING?.split('/')[2]);
        })
        .catch(err => {
            console.error('Error connecting to MongoDB:', err);
            process.exit(1); // Exit the process with failure
        });
}

