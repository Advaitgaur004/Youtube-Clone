import mongoose from 'mongoose';
import { DB_Name } from '../constants.js';
import dotenv from 'dotenv';

dotenv.config(); 

const db = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        const instance = await mongoose.connect(`${db}`);
        console.log('MongoDB connected with host', instance.connection.host);
    } catch (error) {
        console.error('MongoDB connection failed', error);
    }
};

export default connectDB;
