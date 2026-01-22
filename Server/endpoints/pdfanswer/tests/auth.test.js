import request from 'supertest';
import app from '../mainServer.js';
import User from '../models/User.js';

describe('Authentication API', () => {
    const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    };

    test('POST /auth/register should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send(userData);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe(userData.email);
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data).toHaveProperty('refreshToken');

        // Check if user is in DB
        const user = await User.findOne({ email: userData.email });
        expect(user).toBeTruthy();
        expect(user.name).toBe(userData.name);
    });

    test('POST /auth/register should not register an existing user', async () => {
        await User.create(userData);

        const res = await request(app)
            .post('/auth/register')
            .send(userData);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('User already exists with this email');
    });

    test('POST /auth/login should log in an existing user', async () => {
        await User.create(userData);

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: userData.email,
                password: userData.password
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data.user.email).toBe(userData.email);
    });

    test('POST /auth/login should fail with wrong password', async () => {
        await User.create(userData);

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: userData.email,
                password: 'wrongpassword'
            });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid email or password');
    });

    test('GET /auth/profile should return user profile for authenticated user', async () => {
        const user = await User.create(userData);

        // Login to get token
        const loginRes = await request(app)
            .post('/auth/login')
            .send({
                email: userData.email,
                password: userData.password
            });

        const token = loginRes.body.data.accessToken;

        const res = await request(app)
            .get('/auth/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe(userData.email);
        expect(res.body.data.user.name).toBe(userData.name);
    });

    test('GET /auth/profile should fail without token', async () => {
        const res = await request(app).get('/auth/profile');
        expect(res.status).toBe(401);
    });

    test('POST /auth/refresh should return new access token', async () => {
        const user = await User.create(userData);

        const loginRes = await request(app)
            .post('/auth/login')
            .send({
                email: userData.email,
                password: userData.password
            });

        const refreshToken = loginRes.body.data.refreshToken;

        const res = await request(app)
            .post('/auth/refresh')
            .send({ refreshToken });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('accessToken');
    });
});
