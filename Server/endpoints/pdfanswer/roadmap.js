import { Router } from 'express';
import OpenAI from 'openai';

const roadmapRouter = Router();

roadmapRouter.post("/", async (req, res) => {
    const { prompt } = req.body;
    console.log("Roadmap request for:", prompt);

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a master educator. Return ONLY a valid JSON object with exactly two keys: "topic" (string) and "milestones" (array). Each milestone must have "id" (number starting from 1), "title" (string), "description" (string), and "estimatedTime" (string like "2 weeks"). Generate 5-8 milestones.'
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
        console.log("Roadmap generated:", content);

        // Ensure the response has the required structure
        if (!content.milestones || !Array.isArray(content.milestones)) {
            throw new Error("Invalid roadmap structure from AI");
        }

        res.json(content);
    } catch (error) {
        console.error("Roadmap Error:", error.message);
        res.status(500).json({ error: "Failed to generate roadmap", details: error.message });
    }
});

export default roadmapRouter;
