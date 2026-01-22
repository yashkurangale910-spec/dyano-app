import { Router } from 'express';
import OpenAI from 'openai';
import Roadmap from './models/Roadmap.js';
import { authenticateToken } from './middleware/auth.js';

const roadmapRouter = Router();

/**
 * Generate and save a new learning roadmap
 * @route POST /roadmap
 */
roadmapRouter.post("/", authenticateToken, async (req, res) => {
    const { prompt } = req.body;
    const userId = req.user.userId;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a master educator. Return ONLY a valid JSON object with: "title" (string), "goal" (string), and "milestones" (array). Each milestone must have "title" (string), "description" (string), and "order" (number starting from 1).'
                },
                {
                    role: 'user',
                    content: `Create a comprehensive study roadmap to master: ${prompt}`
                }
            ],
            model: 'gpt-3.5-turbo-0125',
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(completion.choices[0].message.content);

        // Save to DB
        const newRoadmap = await Roadmap.create({
            user: userId,
            title: content.title || `Roadmap: ${prompt}`,
            goal: content.goal || prompt,
            steps: content.milestones.map(m => ({
                title: m.title,
                description: m.description,
                order: m.order
            }))
        });

        res.status(201).json({
            success: true,
            message: "Roadmap generated and saved",
            roadmap: newRoadmap
        });
    } catch (error) {
        console.error("Roadmap Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate roadmap",
            error: error.message
        });
    }
});

/**
 * Get all roadmaps for the user
 * @route GET /roadmap
 */
roadmapRouter.get("/", authenticateToken, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json({ success: true, roadmaps });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch roadmaps", error: error.message });
    }
});

export default roadmapRouter;
