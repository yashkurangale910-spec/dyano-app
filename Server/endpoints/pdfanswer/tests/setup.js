import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Set environment variables for testing
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_for_dyano_project_testing';
process.env.JWT_EXPIRES_IN = '1h';
process.env.REFRESH_TOKEN_EXPIRES_IN = '1d';
process.env.NODE_ENV = 'test';

let mongod;

/**
 * Connect to the in-memory database.
 */
beforeAll(async () => {
    console.log('🏁 Starting MongoMemoryServer...');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log(`📡 Connecting to Test DB: ${uri}`);
    await mongoose.connect(uri);
    console.log('✅ Connected to Test DB');
});

/**
 * Drop database, close the connection and stop mongod.
 */
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
});

/**
 * Remove all data from collections between tests.
 */
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
