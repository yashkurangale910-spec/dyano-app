import mongoose from 'mongoose';
import { config } from 'dotenv';
import User from './models/User.js';

config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dyano';
        await mongoose.connect(uri);
        console.log('📡 Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@dyano.com' });
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@dyano.com',
            password: 'password123',
            isActive: true
        });

        console.log('✅ Admin user created successfully');
        console.log('📧 Email: admin@dyano.com');
        console.log('🔑 Password: password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
