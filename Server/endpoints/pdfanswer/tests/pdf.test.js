import request from 'supertest';
import app from '../mainServer.js';
import User from '../models/User.js';
import PDFDocument from '../models/PDFDocument.js';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import path from 'path';
import fs from 'fs';

// Mock everything
vi.mock('@langchain/openai', () => {
    return {
        OpenAIEmbeddings: class {
            constructor() { }
            async embedDocuments() { return []; }
            async embedQuery() { return []; }
        }
    };
});

vi.mock('langchain/document_loaders/fs/pdf', () => {
    return {
        PDFLoader: class {
            constructor() { }
            async load() {
                return [{ pageContent: 'Test PDF Content', metadata: { loc: { pageNumber: 1 } } }];
            }
        }
    };
});

vi.mock('@langchain/community/vectorstores/faiss', () => {
    return {
        FaissStore: {
            fromDocuments: vi.fn().mockResolvedValue({
                save: vi.fn().mockResolvedValue(true)
            }),
            load: vi.fn().mockResolvedValue({
                asRetriever: vi.fn().mockImplementation(() => ({
                    getRelevantDocuments: vi.fn().mockResolvedValue([])
                }))
            })
        }
    };
});

vi.mock('langchain/chains', () => {
    return {
        RetrievalQAChain: class {
            constructor() { }
            async call() {
                return { text: 'Mocked Answer' };
            }
        },
        loadQAStuffChain: vi.fn()
    };
});

describe('PDF API', () => {
    let token;
    let user;

    beforeEach(async () => {
        user = await User.create({
            name: 'Test User',
            email: `pdftest${Date.now()}@example.com`,
            password: 'password123'
        });

        const loginRes = await request(app)
            .post('/auth/login')
            .send({
                email: user.email,
                password: 'password123'
            });

        token = loginRes.body.data.accessToken;

        if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
        if (!fs.existsSync('vector_stores')) fs.mkdirSync('vector_stores');
    });

    test('POST /pdf/upload should upload and process a PDF', async () => {
        const testFilePath = path.join('uploads', `test-${Date.now()}.pdf`);
        fs.writeFileSync(testFilePath, 'dummy content');

        const res = await request(app)
            .post('/pdf/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('pdfFile', testFilePath);

        if (res.status !== 201) console.log('PDF ERROR:', res.body);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);

        if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
    });

    test('GET /pdf/list should fetch user PDFs', async () => {
        await PDFDocument.create({
            user: user._id,
            fileName: 'test.pdf',
            fileUrl: 'uploads/test.pdf',
            status: 'ready'
        });

        const res = await request(app)
            .get('/pdf/list')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.documents.length).toBe(1);
    });
});
