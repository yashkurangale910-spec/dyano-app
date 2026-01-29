import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken, optionalAuth } from './middleware/auth.js';
import { callGemini } from './utils/gemini.js';
import fs from 'fs';
import os from 'os';
import TutorSession from './models/TutorSession.js';
import PDFDocument from './models/PDFDocument.js';

const router = Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
        }
    }
});

/**
 * ADVANCED TRAINING: Personality presets for Spark.E
 * Refined with detailed pedagogical strategies
 */
const PERSONALITIES = {
    friendly: {
        systemPrompt: `You are Spark.E, a friendly and encouraging AI tutor. 
STRATEGY: 
- Use warm, empathetic language ("I'm so glad you asked!", "Great job on tackling this!").
- Break complex ideas into relatable analogies from daily life.
- Focus on building the student's confidence.
- Use emojis sparingly to maintain a modern, friendly vibe.
- Always end with a positive reinforcement or a low-stakes follow-up question.`,
        style: 'conversational and encouraging'
    },
    strict: {
        systemPrompt: `You are Spark.E, a high-performance academic coach. 
STRATEGY:
- Be direct, concise, and professional.
- Use precise academic terminology.
- Identify errors immediately and explain exactly why they are incorrect.
- Set high expectations for the student's rigor.
- Emphasize foundational principles and logical consistency.
- No fluff, just high-density information.`,
        style: 'direct and rigorous'
    },
    socratic: {
        systemPrompt: `You are Spark.E, a Socratic Master. 
STRATEGY:
- NEVER give a direct answer if the student can discover it themselves.
- Respond with a question that leads the student to the next logical step.
- Use "What if...", "How would you explain...", "What's the relationship between..."
- Guide them to identify their own contradictions.
- Your goal is to make the student's brain do 90% of the work.`,
        style: 'questioning and reflective'
    },
    professional: {
        systemPrompt: `You are Spark.E, a Senior Academic Consultant. 
STRATEGY:
- Structure responses with clear headings and bullet points.
- Cite theoretical frameworks and industry standards.
- Provide a balanced view of "Current Theory" vs "Practical Application".
- Use a formal, objective tone.
- Perfect for senior university or professional certification students.`,
        style: 'formal and structured'
    }
};

/**
 * Response depth levels
 */
const DEPTH_LEVELS = {
    brief: 'Provide a concise, pinpoint answer in 2-3 sentences max.',
    standard: 'Provide a clear explanation with one solid example in 1-2 paragraphs.',
    detailed: 'Provide a deep dive with multiple examples, analogies, and a "Common Misconception" section.',
    comprehensive: 'Provide a master-class level analysis: Theory -> Derivation -> Examples -> Edge Cases -> Mastery Quiz Question.'
};

/**
 * Helper to get language-specific instructions for the AI
 */
const getLanguageInstruction = (langCode, type = 'general') => {
    const mappings = {
        'en': {
            general: 'Reply in English.',
            grading: 'Provide all feedback in English.',
            solving: 'Provide all explanations in English.'
        },
        'es': {
            general: 'Reply in Spanish (Español). Use proper Spanish grammar and vocabulary.',
            grading: 'Provide all feedback in Spanish (Español).',
            solving: 'Provide all explanations in Spanish (Español).'
        },
        'fr': {
            general: 'Reply in French (Français). Use proper French grammar and vocabulary.',
            grading: 'Provide all feedback in French (Français).',
            solving: 'Provide all explanations in French (Français).'
        },
        'hi': {
            general: 'Reply in Hindi (हिन्दी). Use Devanagari script and proper Hindi grammar.',
            grading: 'Provide all feedback in Hindi (हिन्दी) using Devanagari script.',
            solving: 'Provide all explanations in Hindi (हिन्दी) using Devanagari script.'
        },
        'mr': {
            general: 'Reply in Marathi (मराठी). Use Devanagari script and proper Marathi grammar.',
            grading: 'Provide all feedback in Marathi (मराठी) using Devanagari script.',
            solving: 'Provide all explanations in Marathi (मराठी) using Devanagari script.'
        }
    };
    const lang = mappings[langCode] || mappings['en'];
    return lang[type] || lang['general'];
};

/**
 * Helper to get framework-specific instructions for the AI
 */
const getFrameworkInstruction = (framework) => {
    if (!framework || framework === 'General') return '';
    return `\nSPECIALIZATION: The student is working with the ${framework} ecosystem. Tailor your examples, code snippets, and best practices specifically to ${framework}. Use idiomatic ${framework} patterns and latest standards.\n`;
};

/**
 * POST /tutor/chat
 * Main chat endpoint with vision and RAG support
 */
router.post('/chat', optionalAuth, upload.single('image'), async (req, res) => {
    try {
        const { message, personality = 'friendly', depth = 'standard', sessionId, documentId, language = 'en', framework = 'General' } = req.body;
        const userId = req.user?.userId || 'anonymous'; // Allow anonymous users
        const image = req.file;
        const languageInstruction = getLanguageInstruction(language, 'general');
        const frameworkInstruction = getFrameworkInstruction(framework);

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        // --- RAG: RETRIEVE CONTEXT IF DOCUMENT PROVIDED ---
        let context = "";
        if (documentId) {
            const pdfDoc = await PDFDocument.findOne({ _id: documentId, user: userId });
            if (pdfDoc) {
                const vectorStorePath = `./vector_stores/${userId}/${path.basename(pdfDoc.fileUrl)}`;
                try {
                    // Temporarily disabled OpenAI Embeddings to prevent crashes
                    // console.log("RAG Retrieval skipped: OpenAI Key invalid");
                } catch (ragError) {
                    console.error("RAG Retrieval skipped:", ragError.message);
                }
            }
        }

        // Get or create session
        let session;
        const isAnonymous = userId === 'anonymous';

        if (sessionId && !isAnonymous) {
            session = await TutorSession.findOne({ _id: sessionId, user: userId });
            if (!session) {
                return res.status(404).json({ success: false, message: 'Session not found' });
            }
        } else {
            // Create a mock session for anonymous users or a real one for logged-in users
            if (isAnonymous) {
                session = {
                    _id: 'anon-' + Date.now(),
                    messages: [],
                    save: async () => { } // Mock save
                };
            } else {
                session = await TutorSession.create({
                    user: userId, personality, depth, messages: []
                });
            }
        }

        // Build messages array
        const messages = [
            {
                role: 'system',
                content: `${PERSONALITIES[personality].systemPrompt}
                
LANGUAGE: ${languageInstruction}
                
                KNOWLEDGE SOURCE: ${context ? "You have access to the student's COURSE MATERIALS. Priority: Use the context below if relevant. \nCONTEXT: " + context : "Use your general knowledge."}
                
                ${frameworkInstruction}

                DEPTH: ${DEPTH_LEVELS[depth]}
                
                FORMATTING RULES:
                - Use LaTeX for ALL mathematical formulas (e.g., $E=mc^2$).
                - Use clear Markdown headings for structure.
                - If the student provides an image, analyze it visually for diagrams, text, or context.`
            },
            ...session.messages.map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            }))
        ];

        // Add user message with image if provided
        if (image) {
            const base64Image = image.buffer.toString('base64');
            messages.push({
                role: 'user',
                content: [
                    { type: 'text', text: message },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:${image.mimetype};base64,${base64Image}`
                        }
                    }
                ]
            });
        } else {
            messages.push({
                role: 'user',
                content: message
            });
        }

        // Get Gemini response (Faster & Free)
        let aiResponse = "";
        try {
            aiResponse = await callGemini(messages, {
                max_tokens: depth === 'comprehensive' ? 2000 : depth === 'detailed' ? 1500 : 1000,
                temperature: personality === 'strict' ? 0.2 : 0.7
            });
        } catch (geminiError) {
            console.error('Gemini Error - Falling back to Local Neural:', geminiError.message);

            // LOCAL LLM FALLBACK (Llama-3.2)
            try {
                const { execSync } = await import('child_process');
                const pythonPath = process.env.PYTHON_PATH || "python";
                const bridgePath = path.join(process.cwd(), 'local_llm_bridge.py');
                const cleanMsg = (message || "Analyze this image").replace(/"/g, '\\"');

                const result = execSync(`"${pythonPath}" "${bridgePath}" "${cleanMsg}"`);
                const parsed = JSON.parse(result.toString());

                if (parsed.success) {
                    aiResponse = parsed.response + "\n\n*(Note: Spark.E is running in Local Emergency Mode)*";
                } else {
                    throw new Error(parsed.error);
                }
            } catch (localError) {
                console.error('Local Fallback failed:', localError.message);
                throw new Error('Both Neural engines failed');
            }
        }

        // Save to session
        session.messages.push(
            { role: 'user', content: message, hasImage: !!image },
            { role: 'assistant', content: aiResponse }
        );
        await session.save();

        res.json({
            success: true,
            response: aiResponse,
            sessionId: session._id,
            messageCount: session.messages.length
        });

    } catch (error) {
        console.error('❌ Tutor Chat Neural Sync Error:', error);

        // LOG TO FILE FOR PERSISTENCE
        try {
            const logMsg = `[${new Date().toISOString()}] CHAT ERROR: ${error.message}\nStack: ${error.stack}\n\n`;
            fs.appendFileSync(path.join(process.cwd(), 'tutor_debug.log'), logMsg);
        } catch (logErr) {
            console.error('Failed to write to debug log:', logErr);
        }

        if (process.env.NODE_ENV === 'development') {
            console.error(error.stack);
        }
        res.status(500).json({
            success: false,
            message: 'Neural sync failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * POST /tutor/grade-essay
 * Grade essays with detailed feedback
 */
router.post('/grade-essay', optionalAuth, async (req, res) => {
    try {
        const { essay, rubric, maxScore = 100, language = 'en', framework = 'General' } = req.body;
        const userId = req.user?.userId || 'anonymous'; // Allow anonymous users
        const languageInstruction = getLanguageInstruction(language, 'grading');
        const frameworkInstruction = getFrameworkInstruction(framework);

        if (!essay) {
            return res.status(400).json({
                success: false,
                message: 'Essay text is required'
            });
        }

        const gradingPrompt = `You are Spark.E, an expert essay grader.

LANGUAGE: ${languageInstruction}

${frameworkInstruction}

Analyze the following essay and provide detailed feedback.

${rubric ? `Grading Rubric:\n${rubric}\n\n` : ''}Essay to Grade:
${essay}

Provide a comprehensive evaluation in the following JSON format:
{
  "score": <number out of ${maxScore}>,
  "overallFeedback": "<2-3 sentence summary>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "categories": {
    "structure": {
      "score": <number>,
      "feedback": "<detailed feedback>"
    },
    "clarity": {
      "score": <number>,
      "feedback": "<detailed feedback>"
    },
    "argumentation": {
      "score": <number>,
      "feedback": "<detailed feedback>"
    },
    "citations": {
      "score": <number>,
      "feedback": "<detailed feedback>"
    },
    "grammar": {
      "score": <number>,
      "feedback": "<detailed feedback>"
    }
  },
  "suggestions": ["<improvement 1>", "<improvement 2>", ...],
  "grade": "<letter grade A-F>"
}`;

        const responseText = await callGemini([{ role: 'user', content: gradingPrompt }], {
            response_format: { type: 'json_object' },
            temperature: 0.3
        });

        const grading = JSON.parse(responseText);

        // Save grading to session if not anonymous
        if (userId !== 'anonymous') {
            await TutorSession.create({
                user: userId,
                type: 'essay_grading',
                messages: [
                    { role: 'user', content: `Essay submission (${essay.length} characters)` },
                    { role: 'assistant', content: JSON.stringify(grading) }
                ],
                metadata: {
                    essayLength: essay.length,
                    score: grading.score,
                    grade: grading.grade
                }
            });
        }

        res.json({
            success: true,
            grading
        });

    } catch (error) {
        console.error('Essay grading error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to grade essay',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * POST /tutor/solve-problem
 * Step-by-step problem solving
 */
router.post('/solve-problem', optionalAuth, async (req, res) => {
    try {
        const { problem, subject, showSteps = true, language = 'en', framework = 'General' } = req.body;
        const userId = req.user?.userId || 'anonymous'; // Allow anonymous users
        const languageInstruction = getLanguageInstruction(language, 'solving');
        const frameworkInstruction = getFrameworkInstruction(framework);

        if (!problem) {
            return res.status(400).json({
                success: false,
                message: 'Problem statement is required'
            });
        }

        const solvingPrompt = `You are Spark.E, an expert problem-solving tutor${subject ? ` specializing in ${subject}` : ''}.

LANGUAGE: ${languageInstruction}

${frameworkInstruction}

Problem:
${problem}

${showSteps ? 'Provide a step-by-step solution with detailed explanations for each step.' : 'Provide the solution with brief explanations.'}

Format your response as JSON:
{
  "steps": [
    {
      "stepNumber": 1,
      "title": "<step title>",
      "explanation": "<detailed explanation>",
      "work": "<mathematical work or reasoning>"
    },
    ...
  ],
  "finalAnswer": "<the final answer>",
  "verification": "<how to verify the answer>",
  "commonMistakes": ["<mistake 1>", "<mistake 2>", ...]
}`;

        const responseText = await callGemini([{ role: 'user', content: solvingPrompt }], {
            response_format: { type: 'json_object' },
            temperature: 0.2
        });

        const solution = JSON.parse(responseText);

        // Save to session if not anonymous
        if (userId !== 'anonymous') {
            await TutorSession.create({
                user: userId,
                type: 'problem_solving',
                messages: [
                    { role: 'user', content: problem },
                    { role: 'assistant', content: JSON.stringify(solution) }
                ],
                metadata: {
                    subject,
                    stepCount: solution.steps.length
                }
            });
        }

        res.json({
            success: true,
            solution
        });

    } catch (error) {
        console.error('Problem solving error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to solve problem',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /tutor/sessions
 * Get user's tutor sessions
 */
router.get('/sessions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type, limit = 20 } = req.query;

        const query = { user: userId };
        if (type) query.type = type;

        const sessions = await TutorSession.find(query)
            .sort({ updatedAt: -1 })
            .limit(parseInt(limit))
            .select('-messages'); // Exclude full messages for list view

        res.json({
            success: true,
            sessions
        });

    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sessions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /tutor/sessions/:id
 * Get specific session with full messages
 */
router.get('/sessions/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const sessionId = req.params.id;

        const session = await TutorSession.findOne({
            _id: sessionId,
            user: userId
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.json({
            success: true,
            session
        });

    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch session',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /tutor/progress
 * Get learning progress and milestones
 */
router.get('/progress', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const sessions = await TutorSession.find({ user: userId });

        const stats = {
            totalSessions: sessions.length,
            chatSessions: sessions.filter(s => s.type === 'chat').length,
            essaysGraded: sessions.filter(s => s.type === 'essay_grading').length,
            problemsSolved: sessions.filter(s => s.type === 'problem_solving').length,
            totalMessages: sessions.reduce((sum, s) => sum + s.messages.length, 0),
            averageEssayScore: 0,
            personalities: {},
            subjects: {}
        };

        // Calculate average essay score
        const gradedEssays = sessions.filter(s => s.type === 'essay_grading' && s.metadata?.score);
        if (gradedEssays.length > 0) {
            stats.averageEssayScore = Math.round(
                gradedEssays.reduce((sum, s) => sum + s.metadata.score, 0) / gradedEssays.length
            );
        }

        // Count personality usage
        sessions.forEach(s => {
            if (s.personality) {
                stats.personalities[s.personality] = (stats.personalities[s.personality] || 0) + 1;
            }
            if (s.metadata?.subject) {
                stats.subjects[s.metadata.subject] = (stats.subjects[s.metadata.subject] || 0) + 1;
            }
        });

        res.json({
            success: true,
            progress: stats
        });

    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch progress',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * DELETE /tutor/sessions/:id
 * Delete a session
 */
router.delete('/sessions/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const sessionId = req.params.id;

        const result = await TutorSession.deleteOne({
            _id: sessionId,
            user: userId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.json({
            success: true,
            message: 'Session deleted successfully'
        });

    } catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete session',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;
