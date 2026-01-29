import { MongoMemoryServer } from 'mongodb-memory-server';

async function test() {
    console.log('Starting MongoMemoryServer...');
    try {
        const mongod = await MongoMemoryServer.create({
            instance: {
                timeout: 120000 // 2 minutes
            }
        });
        console.log('MongoMemoryServer started at:', mongod.getUri());
        await mongod.stop();
    } catch (err) {
        console.error('Failed to start MongoMemoryServer:', err);
    }
}

test();
