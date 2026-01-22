import apiClient from '../config/api';

/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */
class AuthService {
    /**
     * Register new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} name - User name
     * @returns {Promise<Object>} Registration response
     */
    async register(email, password, name) {
        const response = await apiClient.post('/auth/register', {
            email,
            password,
            name
        });

        if (response.data.success) {
            this.setTokens(
                response.data.data.accessToken,
                response.data.data.refreshToken
            );
            this.setUser(response.data.data.user);
        }

        return response.data;
    }

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Login response
     */
    async login(email, password) {
        const response = await apiClient.post('/auth/login', {
            email,
            password
        });

        if (response.data.success) {
            this.setTokens(
                response.data.data.accessToken,
                response.data.data.refreshToken
            );
            this.setUser(response.data.data.user);
        }

        return response.data;
    }

    /**
     * Logout user
     * Clears tokens and user data from storage
     */
    async logout() {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuth();
        }
    }

    /**
     * Get user profile
     * @returns {Promise<Object>} User profile data
     */
    async getProfile() {
        const response = await apiClient.get('/auth/profile');
        return response.data;
    }

    /**
     * Refresh access token
     * @returns {Promise<Object>} New access token
     */
    async refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post('/auth/refresh', {
            refreshToken
        });

        if (response.data.success) {
            this.setAccessToken(response.data.data.accessToken);
        }

        return response.data;
    }

    /**
     * Set both access and refresh tokens in localStorage
     * @param {string} accessToken - JWT access token
     * @param {string} refreshToken - JWT refresh token
     */
    setTokens(accessToken, refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    /**
     * Set access token in localStorage
     * @param {string} accessToken - JWT access token
     */
    setAccessToken(accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }

    /**
     * Get access token from localStorage
     * @returns {string|null} Access token or null
     */
    getAccessToken() {
        return localStorage.getItem('accessToken');
    }

    /**
     * Get refresh token from localStorage
     * @returns {string|null} Refresh token or null
     */
    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    /**
     * Set user data in localStorage
     * @param {Object} user - User data object
     */
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Get user data from localStorage
     * @returns {Object|null} User data or null
     */
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Clear all authentication data from localStorage
     */
    clearAuth() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} True if access token exists
     */
    isAuthenticated() {
        return !!this.getAccessToken();
    }
}

// Export singleton instance
export default new AuthService();
