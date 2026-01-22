import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Manages authentication state for the entire application
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const userData = authService.getUser();
                    setUser(userData);
                    setIsAuthenticated(true);

                    // Optionally verify token is still valid by fetching profile
                    // Uncomment if you want to verify on mount
                    // try {
                    //   const response = await authService.getProfile();
                    //   if (response.success) {
                    //     setUser(response.data.user);
                    //   }
                    // } catch (error) {
                    //   // Token invalid, clear auth
                    //   authService.clearAuth();
                    //   setUser(null);
                    //   setIsAuthenticated(false);
                    // }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                authService.clearAuth();
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    /**
     * Register new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} name - User name
     * @returns {Promise<Object>} Result with success status and message
     */
    const register = async (email, password, name) => {
        try {
            const response = await authService.register(email, password, name);

            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                return { success: true };
            }

            return {
                success: false,
                message: response.message || 'Registration failed'
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed. Please try again.'
            };
        }
    };

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Result with success status and message
     */
    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);

            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                return { success: true };
            }

            return {
                success: false,
                message: response.message || 'Login failed'
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please check your credentials.'
            };
        }
    };

    /**
     * Logout user
     * Clears authentication state and redirects to login
     */
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    /**
     * Update user data
     * @param {Object} userData - Updated user data
     */
    const updateUser = (userData) => {
        setUser(userData);
        authService.setUser(userData);
    };

    // Context value
    const value = {
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};

export default AuthContext;
