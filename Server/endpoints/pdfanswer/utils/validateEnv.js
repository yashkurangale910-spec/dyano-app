/**
 * Validate required environment variables
 * Throws error if any required variable is missing
 */
export const validateEnv = () => {
    const required = [
        'OPENAI_API_KEY',
        'JWT_SECRET',
        'MONGODB_URI'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            `Please check your .env file and ensure all required variables are set.`
        );
    }

    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET.length < 32) {
        console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters for security');
    }

    // Validate OpenAI API key format
    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
        console.warn('⚠️  WARNING: OPENAI_API_KEY format may be invalid');
    }

    console.log('✅ Environment variables validated successfully');
};

/**
 * Get environment-specific configuration
 */
export const getConfig = () => {
    const env = process.env.NODE_ENV || 'development';

    return {
        env,
        isDevelopment: env === 'development',
        isProduction: env === 'production',
        isTest: env === 'test',
        port: process.env.PORT || 3005,
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
        mongoUri: process.env.MONGODB_URI,
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
        openaiApiKey: process.env.OPENAI_API_KEY
    };
};

export default { validateEnv, getConfig };
