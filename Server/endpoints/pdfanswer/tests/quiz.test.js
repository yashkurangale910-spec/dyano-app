import request from 'supertest';
import app from '../mainServer.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
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
                                            questions: [
                                                {
                                                    questionText: 'Test Question',
                                                    options: ['A', 'B', 'C', 'D'],
                                                    correctAnswer: 'A',
                                                    explanation: 'Test Explanation'
                                                }
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

describe('Quiz API', () => {
    let token;
    let user;

    beforeEach(async () => {
        user = await User.create({
            name: 'Test User',
            email: `quiztest${Date.now()}@example.com`,
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

    test('POST /quiz should generate and save a quiz', async () => {
        const res = await request(app)
            .post('/quiz')
            .set('Authorization', `Bearer ${token}`)
            .send({ prompt: 'JavaScript', difficulty: 'easy' });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.quiz).toHaveProperty('_id');
        expect(res.body.quiz.topic).toBe('JavaScript');
        expect(res.body.quiz.questions.length).toBe(1);

        // Verify it's in DB
        const quizInDb = await Quiz.findById(res.body.quiz._id);
        expect(quizInDb).toBeTruthy();
        expect(quizInDb.user.toString()).toBe(user._id.toString());
    });

    test('GET /quiz should fetch user quizzes', async () => {
        await Quiz.create({
            user: user._id,
            title: 'Existing Quiz',
            topic: 'History',
            questions: [],
            totalQuestions: 0
        });

        const res = await request(app)
            .get('/quiz')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.quizzes.length).toBe(1);
        expect(res.body.quizzes[0].topic).toBe('History');
    });

    test('GET /quiz should fail without token', async () => {
        const res = await request(app).get('/quiz');
        expect(res.status).toBe(401);
    });
});
