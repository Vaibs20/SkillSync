// src / dbConfig / dbConfig.ts
import mongoose from "mongoose";

export async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB connected...');
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('MongoDB connected...');
        });
        connection.on('error', (err) => {
            console.log('MongoDB connection error:' + err);
            process.exit(1);
        });
    } catch (error) {
        console.log('Something went wrong:', error);
    }
};
