import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const URL = process.env.MONGODB_URL;

const connectMONGODB = async () => {
    try {
        await mongoose.connect(URL);
        console.log('MONGODB Connected Successfully');
    } catch (error) {
        console.log('MONGODB failed to connect');
    }
};

// connectMONGODB()

export {connectMONGODB,URL};