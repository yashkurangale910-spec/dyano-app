import { callGemini } from './utils/gemini.js';
import { writeFileSync } from 'fs';
import { randomUUID } from 'crypto';

const imageGenerator = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Prompt is required and must be a string'
      });
    }

    if (prompt.length > 500) {
      return res.status(400).json({
        error: 'Prompt too long',
        message: 'Prompt must be less than 500 characters'
      });
    }

    // Generate text explanation (await to fix race condition)
    const explanation = await callGemini([{
      role: 'user',
      content: `Explain ${prompt} in 80 words`
    }], {
      temperature: 0.7
    });

    // Generate image (Note: Gemini 1.5 Flash doesn't support image generation natively via this API)
    // We will use a high-quality placeholder for now to prevent the function from crashing
    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=512&height=512&seed=42&model=flux`;

    // Download and save image
    const imgResponse = await fetch(imageUrl);
    const blob = await imgResponse.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Use UUID for unique filename instead of counter
    const uniqueId = randomUUID();
    const filename = `image_${uniqueId}.png`;
    const filepath = `./img/${filename}`;

    writeFileSync(filepath, buffer);

    // Return response
    res.status(200).json({
      data: explanation,
      imgUrl: `${req.protocol}://${req.get('host')}/img/${filename}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Image generation error:', error.message);

    // Handle specific OpenAI errors
    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.'
      });
    }

    if (error.status === 401) {
      return res.status(500).json({
        error: 'API configuration error',
        message: 'Invalid API key configuration'
      });
    }

    res.status(500).json({
      error: 'Failed to generate content',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
    });
  }
};

export default imageGenerator;