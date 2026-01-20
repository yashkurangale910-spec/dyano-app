import { Router } from 'express';
import OpenAI from 'openai';

const flashcardsRouter = Router();

flashcardsRouter.post("/", async (req, res) => {
    const { prompt } = req.body;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a study aid generator. Return only a JSON array of objects representing flashcards. Each object must have "front" (a term or question) and "back" (a concise definition or answer).'
                },
                {
                    role: 'user',
                    content: `Generate 8-10 flashcards for the following topic/text: ${prompt}`
                }
            ],
            model: 'gpt-3.5-turbo-0125',
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(completion.choices[0].message.content);
        const cards = content.flashcards || content.cards || content;

        res.json({ flashcards: Array.isArray(cards) ? cards : [cards] });
    } catch (error) {
        console.error("Flashcard Error:", error);
        res.status(500).json({ error: "Failed to generate flashcards" });
    }
});

export default flashcardsRouter;
