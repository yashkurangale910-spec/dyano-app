import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Configure and connect to MongoDB
 * Provides a fallback to an in-memory database for local development if needed
 */
const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        // Use In-Memory Database for development if URI is the default localhost 
        // and we want to ensure it works even if local MongoDB isn't installed
        if (process.env.NODE_ENV === 'development' && uri === 'mongodb://localhost:27017/dyano') {
            try {
                console.log('🔄 Attempting to connect to local MongoDB...');
                await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
                console.log(`📡 Local MongoDB Connected: ${uri}`);
                return;
            } catch (err) {
                console.log('⚠️ Local MongoDB not found. Starting In-Memory MongoDB Server...');
                const mongod = await MongoMemoryServer.create();
                uri = mongod.getUri();
            }
        }

        const conn = await mongoose.connect(uri);
        console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        // If it's a critical prod error, exit
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

export default connectDB;
