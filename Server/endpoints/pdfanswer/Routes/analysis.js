import express from 'express';
import FallacyDetector from '../utils/fallacyDetector.js';

const router = express.Router();

// Initialize detector with Gemini API Key
const detector = new FallacyDetector(process.env.GEMINI_API_KEY);

router.post('/fallacy-check', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ success: false, message: 'Text is required' });

        const analysis = await detector.detect(text);
        res.json({ success: true, data: analysis });
    } catch (error) {
        console.error('Fallacy check error:', error);
        res.status(500).json({ success: false, message: 'Analysis failed' });
    }
});

export default router;
