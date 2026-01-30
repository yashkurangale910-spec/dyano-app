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
    },
    creative: {
        systemPrompt: `You are Spark.E, a Neural Fusion visionary. 
STRATEGY:
- Use rich metaphors, visual analogies, and cross-disciplinary connections.
- Encourage "outside the box" thinking.
- Relate abstract concepts to art, nature, or science fiction.
- Provide multi-modal explanations (visual descriptions + theory).
- Focus on the "Why" and the "Interconnectedness" of knowledge.`,
        style: 'imaginative and metaphorical'
    },
    robotic: {
        systemPrompt: `You are Spark.E, Unit 7. Execute protocols with maximum efficiency.
STRATEGY:
- Use highly structured, technical, and mechanical language.
- Prefix some responses with "PROTOCOL: ", "DATA_RETRIEVAL: ", or "ANALYSIS: ".
- Avoid all human sentiment. Focus on raw data and logic.
- Use bullet points for clear data output.
- Reiterate that you are a machine executing a learning algorithm.`,
        style: 'computational and mechanical'
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
        },
        'de': {
            general: 'Reply in German (Deutsch). Use proper German grammar and vocabulary.',
            grading: 'Provide all feedback in German (Deutsch).',
            solving: 'Provide all explanations in German (Deutsch).'
        },
        'pt': {
            general: 'Reply in Portuguese (Português). Use proper Portuguese grammar and vocabulary.',
            grading: 'Provide all feedback in Portuguese (Português).',
            solving: 'Provide all explanations in Portuguese (Português).'
        },
        'ja': {
            general: 'Reply in Japanese (日本語). Use proper Japanese kanji, hiragana, and katakana.',
            grading: 'Provide all feedback in Japanese (日本語).',
            solving: 'Provide all explanations in Japanese (日本語).'
        },
        'ru': {
            general: 'Reply in Russian (Русский). Use Cyrillic script and proper Russian grammar.',
            grading: 'Provide all feedback in Russian (Русский) using Cyrillic script.',
            solving: 'Provide all explanations in Russian (Русский) using Cyrillic script.'
        },
        'zh': {
            general: 'Reply in Chinese (中文). Use Simplified Chinese characters and proper grammar.',
            grading: 'Provide all feedback in Chinese (中文).',
            solving: 'Provide all explanations in Chinese (中文).'
        },
        'it': {
            general: 'Reply in Italian (Italiano). Use proper Italian grammar and vocabulary.',
            grading: 'Provide all feedback in Italian (Italiano).',
            solving: 'Provide all explanations in Italian (Italiano).'
        },
        'ko': {
            general: 'Reply in Korean (한국어). Use proper Hangul script and honorifics.',
            grading: 'Provide all feedback in Korean (한국어).',
            solving: 'Provide all explanations in Korean (한국어).'
        },
        'ar': {
            general: 'Reply in Arabic (العربية). Use proper Arabic script and grammar.',
            grading: 'Provide all feedback in Arabic (العربية).',
            solving: 'Provide all explanations in Arabic (العربية).'
        },
        'ta': {
            general: 'Reply in Tamil (தமிழ்). Use proper Tamil script and grammar.',
            grading: 'Provide all feedback in Tamil (தமிழ்).',
            solving: 'Provide all explanations in Tamil (தமிழ்).'
        },
        'te': {
            general: 'Reply in Telugu (తెలుగు). Use proper Telugu script and grammar.',
            grading: 'Provide all feedback in Telugu (తెలుగు).',
            solving: 'Provide all explanations in Telugu (తెలుగు).'
        },
        'bn': {
            general: 'Reply in Bengali (বাংলা). Use proper Bengali script and grammar.',
            grading: 'Provide all feedback in Bengali (বাংলা).',
            solving: 'Provide all explanations in Bengali (বাংলা).'
        },
        'tr': {
            general: 'Reply in Turkish (Türkçe). Use proper Turkish grammar and vocabulary.',
            grading: 'Provide all feedback in Turkish (Türkçe).',
            solving: 'Provide all explanations in Turkish (Türkçe).'
        },
        'vi': {
            general: 'Reply in Vietnamese (Tiếng Việt). Use proper Vietnamese grammar and tones.',
            grading: 'Provide all feedback in Vietnamese (Tiếng Việt).',
            solving: 'Provide all explanations in Vietnamese (Tiếng Việt).'
        },
        'nl': {
            general: 'Reply in Dutch (Nederlands). Use proper Dutch grammar and vocabulary.',
            grading: 'Provide all feedback in Dutch (Nederlands).',
            solving: 'Provide all explanations in Dutch (Nederlands).'
        },
        'id': {
            general: 'Reply in Indonesian (Bahasa Indonesia). Use proper Indonesian grammar and vocabulary.',
            grading: 'Provide all feedback in Indonesian (Bahasa Indonesia).',
            solving: 'Provide all explanations in Indonesian (Bahasa Indonesia).'
        },
        'pl': {
            general: 'Reply in Polish (Polski). Use proper Polish grammar and vocabulary.',
            grading: 'Provide all feedback in Polish (Polski).',
            solving: 'Provide all explanations in Polish (Polski).'
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

        // Robustness: Map common synonyms and ensure valid enum values
        const depthMap = { 'beginner': 'brief', 'intermediate': 'standard', 'advanced': 'detailed', 'expert': 'comprehensive' };
        const validatedDepth = depthMap[depth] || (['brief', 'standard', 'detailed', 'comprehensive'].includes(depth) ? depth : 'standard');
        const validatedPersonality = PERSONALITIES[personality] ? personality : 'friendly';

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
                    user: userId, personality: validatedPersonality, depth: validatedDepth, messages: []
                });
            }
        }

        // Build messages array
        const personalityProfile = PERSONALITIES[personality] || PERSONALITIES.friendly;
        const messages = [
            {
                role: 'system',
                content: `${personalityProfile.systemPrompt}
                
STRICT LANGUAGE PROTOCOL: 
${languageInstruction}
Do not mix languages. If the user asks in a specific language, stick to it 100%.
                
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
            console.error('❌ Gemini Error:', geminiError.message);
            throw new Error(`Neural sync disrupted: ${geminiError.message}`);
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
