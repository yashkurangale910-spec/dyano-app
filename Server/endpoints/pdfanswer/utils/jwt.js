import jwt from 'jsonwebtoken';

/**
 * Helper to get JWT config from environment
 */
const getJwtConfig = () => {
    return {
        secret: process.env.JWT_SECRET,
        accessExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'
    };
};

/**
 * Generate access token
 */
export const generateAccessToken = (userId, email) => {
    const config = getJwtConfig();
    if (!config.secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(
        { userId, email },
        config.secret,
        { expiresIn: config.accessExpiresIn }
    );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId) => {
    const config = getJwtConfig();
    if (!config.secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(
        { userId },
        config.secret,
        { expiresIn: config.refreshExpiresIn }
    );
};

/**
 * Verify token
 */
export const verifyToken = (token) => {
    const config = getJwtConfig();
    if (!config.secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
        return jwt.verify(token, config.secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Decode token without verification
 */
export const decodeToken = (token) => {
    return jwt.decode(token);
};
