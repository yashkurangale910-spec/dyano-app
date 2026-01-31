import { Router } from 'express';
import Roadmap from './models/supabase/Roadmap.js';
import { authenticateToken } from './middleware/auth.js';
import { callGemini } from './utils/gemini.js';

const roadmapRouter = Router();

function parseLLMJson(text) {
    try { return JSON.parse(text); }
    catch (e) {
        const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match) {
            try { return JSON.parse(match[1]); }
            catch (innerE) { throw new Error("Malformed JSON block: " + innerE.message); }
        }
        throw e;
    }
}

/**
 * Generate and save a new learning roadmap
 * @route POST /roadmap
 */
roadmapRouter.post("/", authenticateToken, async (req, res) => {
    const { prompt } = req.body;
    const userId = req.user.userId;

    try {
        const responseText = await callGemini([
            {
                role: 'system',
                content: 'You are a master educator. Return ONLY a valid JSON object with: "title" (string), "goal" (string), and "milestones" (array). Each milestone must have "title" (string), "description" (string), and "order" (number starting from 1).'
            },
            {
                role: 'user',
                content: `Create a comprehensive study roadmap to master: ${prompt}`
            }
        ], {
            response_format: { type: "json_object" }
        });

        const content = parseLLMJson(responseText);

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
        const roadmaps = await Roadmap.find({ user: req.user.userId }, { createdAt: -1 });
        res.json({ success: true, roadmaps });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch roadmaps", error: error.message });
    }
});

/**
 * Get a "Neural Rewind" summary of the last 3 completed nodes
 * @route GET /roadmap/rewind/:id
 */
roadmapRouter.get("/rewind/:id", authenticateToken, async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.user.userId });

        if (!roadmap) {
            return res.status(404).json({ success: false, message: "Roadmap not found" });
        }

        const completedSteps = roadmap.steps
            .filter(step => step.isCompleted)
            .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
            .slice(0, 3);

        if (completedSteps.length === 0) {
            return res.json({
                success: true,
                summary: "NEURAL_LINK_STABLE: No mastered nodes detected. Proceed with initialization."
            });
        }

        const stepsText = completedSteps.map(s => `- ${s.title}: ${s.description}`).join('\n');

        const summaryResponse = await callGemini([
            {
                role: 'system',
                content: `You are the Spark.E Neural Refresher. Generate a high-intensity, cinematic "Neural Rewind" summary of the user's recently mastered topics. 
                FORMAT: 
                - Use a "Cognitive Pulse" style (prefix with NEURAL_LINK_ESTABLISHED).
                - Be concise (max 100 words).
                - Highlight key takeaways and how they connect to the OVERALL GOAL: ${roadmap.goal}.
                - End with a motivating "Ready for Synthesis" signal.`
            },
            {
                role: 'user',
                content: `Topics to refresh:\n${stepsText}`
            }
        ]);

        res.json({ success: true, summary: summaryResponse });
    } catch (error) {
        console.error("Rewind Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate rewire", error: error.message });
    }
});

export default roadmapRouter;
