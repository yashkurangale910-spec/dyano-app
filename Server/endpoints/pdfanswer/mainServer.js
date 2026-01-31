import './utils/cleanupPort.js'; // Ensure port is clear before starting
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import imageGenerator from './final.js';
import pdfRouter from "./server.js";
import path from "node:path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import quizRouter from "./quiz.js";
import flashcardsRouter from "./flashcards.js";
import roadmapRouter from "./roadmap.js";
import analysisRouter from "./routes/analysis.js";
import tutorRouter from "./tutor.js";
import authRouter from "./routes/auth.js";
import progressRouter from "./routes/progress.js";
import connectDB from "./config/db.js";
import { apiLimiter, authLimiter, aiLimiter } from './middleware/rateLimiter.js';
import { cacheMiddleware } from './middleware/cache.js';
import { validateEnv } from './utils/validateEnv.js';

// Load environment variables
config();

// Validate environment variables (skip in test mode)
if (process.env.NODE_ENV !== 'test') {
    try {
        validateEnv();
    } catch (error) {
        console.error('❌ Environment validation failed:', error.message);
        process.exit(1);
    }
}

const app = express();

// Basic request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Connect to Database (Skip if in test mode)
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// Performance: Compression
app.use(compression());

// Security: Helmet (HTTP headers)
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false
}));

// Security: Request size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security: CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Static files
app.use('/img', express.static(path.join(__dirname, 'img')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Dyano API Server",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            auth: "/auth",
            pdf: "/pdf",
            quiz: "/quiz",
            flashcards: "/flashcards",
            roadmap: "/roadmap",
            content: "/img"
        }
    });
});

// API Routes
app.use('/auth', authLimiter, authRouter);
app.use('/progress', apiLimiter, progressRouter);
app.post('/img', aiLimiter, imageGenerator);
app.use("/pdf", apiLimiter, pdfRouter);
app.use("/quiz", aiLimiter, quizRouter);
app.use("/flashcards", aiLimiter, flashcardsRouter);
app.use("/roadmap", aiLimiter, roadmapRouter);
app.use("/analysis", aiLimiter, analysisRouter);
app.use("/tutor", aiLimiter, tutorRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`,
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(status).json({
        error: message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

// Server configuration
const PORT = process.env.PORT || 3005;

if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Dyano API Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        console.log(`⚡ Neural Sync (WebSocket) ready`);
    });

    // Initialize WebSocket Server for CRDTs
    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws, req) => {
        setupWSConnection(ws, req);
    });

    server.on('upgrade', (request, socket, head) => {
        // You can handle authentication here if needed
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
        console.log(`\n${signal} received. Starting graceful shutdown...`);

        server.close(() => {
            console.log('✅ Server closed. Exiting process.');
            process.exit(0);
        });

        // Force shutdown after 10 seconds
        setTimeout(() => {
            console.error('⚠️ Forced shutdown after timeout');
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default app;
