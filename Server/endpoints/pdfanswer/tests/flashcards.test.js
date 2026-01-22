import request from 'supertest';
import app from '../mainServer.js';
import User from '../models/User.js';
import FlashcardSet from '../models/FlashcardSet.js';
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
                                            flashcards: [
                                                { front: 'JS', back: 'JavaScript' },
                                                { front: 'React', back: 'UI Library' }
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

describe('Flashcards API', () => {
    let token;
    let user;

    beforeEach(async () => {
        user = await User.create({
            name: 'Test User',
            email: `flashcardtest${Date.now()}@example.com`,
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

    test('POST /flashcards should generate and save flashcards', async () => {
        const res = await request(app)
            .post('/flashcards')
            .set('Authorization', `Bearer ${token}`)
            .send({ prompt: 'Programming' });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.flashcards).toHaveProperty('_id');
        expect(res.body.flashcards.cards.length).toBe(2);

        // Verify in DB
        const setInDb = await FlashcardSet.findById(res.body.flashcards._id);
        expect(setInDb).toBeTruthy();
    });

    test('GET /flashcards should fetch user flashcard sets', async () => {
        await FlashcardSet.create({
            user: user._id,
            title: 'Existing Set',
            topic: 'Math',
            cards: []
        });

        const res = await request(app)
            .get('/flashcards')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.flashcardSets.length).toBe(1);
    });
});
