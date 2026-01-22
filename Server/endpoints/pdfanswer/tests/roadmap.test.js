import request from 'supertest';
import app from '../mainServer.js';
import User from '../models/User.js';
import Roadmap from '../models/Roadmap.js';
import { vi, describe, beforeEach, test, expect } from 'vitest';

// Mock OpenAI
vi.mock('openai', () => {
    return {
        default: class {
            constructor() {
                this.chat = {
                    completions: {
                        create: vi.fn().mockResolvedValue({
                            choices: [
                                {
                                    message: {
                                        content: JSON.stringify({
                                            title: 'Master Node.js',
                                            goal: 'Become a pro',
                                            milestones: [
                                                { title: 'Basics', description: 'JS fundamentals', order: 1 },
                                                { title: 'Express', description: 'Web servers', order: 2 }
                                            ]
                                        })
                                    }
                                }
                            ]
                        })
                    }
                };
            }
        }
    };
});

describe('Roadmap API', () => {
    let token;
    let user;

    beforeEach(async () => {
        user = await User.create({
            name: 'Test User',
            email: `roadmaptest${Date.now()}@example.com`,
            password: 'password123'
        });

        const loginRes = await request(app)
            .post('/auth/login')
            .send({
                email: user.email,
                password: 'password123'
            });

        token = loginRes.body.data.accessToken;
    });

    test('POST /roadmap should generate and save a roadmap', async () => {
        const res = await request(app)
            .post('/roadmap')
            .set('Authorization', `Bearer ${token}`)
            .send({ prompt: 'Node.js' });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.roadmap).toHaveProperty('_id');
        expect(res.body.roadmap.steps.length).toBe(2);

        // Verify in DB
        const roadmapInDb = await Roadmap.findById(res.body.roadmap._id);
        expect(roadmapInDb).toBeTruthy();
        expect(roadmapInDb.title).toBe('Master Node.js');
    });

    test('GET /roadmap should fetch user roadmaps', async () => {
        await Roadmap.create({
            user: user._id,
            title: 'Existing Path',
            goal: 'Learn AI',
            steps: []
        });

        const res = await request(app)
            .get('/roadmap')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.roadmaps.length).toBe(1);
    });
});
