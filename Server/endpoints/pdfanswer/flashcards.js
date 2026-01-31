import { Router } from 'express';
import FlashcardSet from './models/supabase/FlashcardSet.js';
import { authenticateToken } from './middleware/auth.js';
import { callGemini } from './utils/gemini.js';
import { calculateNextReview, getDueCards, getStudyStats } from './utils/spacedRepetition.js';

const flashcardsRouter = Router();

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
 * Generate and save a new flashcard set
 * @route POST /flashcards
 */
flashcardsRouter.post("/", authenticateToken, async (req, res) => {
    const { prompt } = req.body;
    const userId = req.user.userId;

    try {
        const responseText = await callGemini([
            {
                role: 'system',
                content: 'You are a study aid generator. Return only a JSON object with a "flashcards" key containing an array of objects. Each object must have "front" (a term or question) and "back" (a concise definition or answer).'
            },
            {
                role: 'user',
                content: `Generate 8-10 flashcards for the following topic/text: ${prompt}`
            }
        ], {
            response_format: { type: "json_object" }
        });

        const content = parseLLMJson(responseText);
        const cardsList = content.flashcards || content.cards || content;
        const finalCards = Array.isArray(cardsList) ? cardsList : [cardsList];

        // Save to DB
        const newFlashcardSet = await FlashcardSet.create({
            user: userId,
            title: `Flashcards: ${prompt}`,
            topic: prompt,
            cards: finalCards
        });

        res.status(201).json({
            success: true,
            message: "Flashcard set generated and saved",
            flashcards: newFlashcardSet
        });
    } catch (error) {
        console.error("Flashcard Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate flashcards",
            error: error.message
        });
    }
});

/**
 * Get all flashcard sets for the user
 * @route GET /flashcards
 */
flashcardsRouter.get("/", authenticateToken, async (req, res) => {
    try {
        const sets = await FlashcardSet.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json({ success: true, flashcardSets: sets });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch flashcards", error: error.message });
    }
});

/**
 * Get due cards for review
 * @route GET /flashcards/:setId/due
 */
flashcardsRouter.get("/:setId/due", authenticateToken, async (req, res) => {
    try {
        const set = await FlashcardSet.findOne({ _id: req.params.setId, user: req.user.userId });
        if (!set) {
            return res.status(404).json({ success: false, message: "Flashcard set not found" });
        }

        const dueCards = getDueCards(set.cards);
        const stats = getStudyStats(set.cards);

        res.json({
            success: true,
            dueCards,
            stats
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch due cards", error: error.message });
    }
});

/**
 * Update card after review
 * @route POST /flashcards/:setId/review
 */
flashcardsRouter.post("/:setId/review", authenticateToken, async (req, res) => {
    try {
        const { cardIndex, quality } = req.body;
        const set = await FlashcardSet.findOne({ _id: req.params.setId, user: req.user.userId });

        if (!set) {
            return res.status(404).json({ success: false, message: "Flashcard set not found" });
        }

        if (cardIndex < 0 || cardIndex >= set.cards.length) {
            return res.status(400).json({ success: false, message: "Invalid card index" });
        }

        const card = set.cards[cardIndex];
        const { nextReviewDate, newDifficulty, interval } = calculateNextReview(card.difficulty, quality);

        set.cards[cardIndex].difficulty = newDifficulty;
        set.cards[cardIndex].nextReview = nextReviewDate;

        await set.save();

        res.json({
            success: true,
            message: "Card reviewed successfully",
            nextReview: nextReviewDate,
            difficulty: newDifficulty,
            interval
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to review card", error: error.message });
    }
});

export default flashcardsRouter;
