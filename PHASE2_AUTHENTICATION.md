# 🔐 PHASE 2: AUTHENTICATION & USER MANAGEMENT
## Implementation Checklist & Guide

**Duration:** 2-3 weeks  
**Priority:** 🔴 CRITICAL  
**Status:** 📋 Ready to Start

---

## 📊 Progress Tracker

**Overall Progress:** 0% Complete

- [ ] Backend Authentication (0/10 tasks)
- [ ] Frontend Authentication (0/10 tasks)
- [ ] Testing & Validation (0/5 tasks)
- [ ] Documentation (0/3 tasks)

---

## 🎯 WEEK 1: Backend Authentication

### Day 1-2: Setup & Dependencies

#### ✅ Task 1.1: Install Dependencies
```bash
cd Server/endpoints/pdfanswer
npm install jsonwebtoken bcryptjs express-validator
```

**Dependencies:**
- `jsonwebtoken` - JWT token generation/validation
- `bcryptjs` - Password hashing
- `express-validator` - Input validation

**Verify Installation:**
```bash
npm list jsonwebtoken bcryptjs express-validator
```

---

#### ✅ Task 1.2: Create Directory Structure
```bash
# From Server/endpoints/pdfanswer/
mkdir middleware
mkdir routes
mkdir controllers
mkdir utils
```

**Expected Structure:**
```
Server/endpoints/pdfanswer/
├── middleware/
│   └── auth.js          # 👈 CREATE THIS
├── routes/
│   └── auth.js          # 👈 CREATE THIS
├── controllers/
│   └── authController.js # 👈 CREATE THIS
├── utils/
│   └── jwt.js           # 👈 CREATE THIS
└── mainServer.js        # ✏️ MODIFY THIS
```

---

#### ✅ Task 1.3: Update Environment Variables

**File:** `Server/endpoints/pdfanswer/.env`

**Add these lines:**
```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
```

**Generate a secure JWT_SECRET:**
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: OpenSSL
openssl rand -hex 64
```

**Update:** `Server/endpoints/pdfanswer/.env.example`
```env
# Add to .env.example
JWT_SECRET=your_jwt_secret_here_minimum_32_characters
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
```

---

### Day 3-4: JWT Utilities & Middleware

#### ✅ Task 1.4: Create JWT Utilities

**File:** `Server/endpoints/pdfanswer/utils/jwt.js`

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

/**
 * Generate access token
 */
export const generateAccessToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

/**
 * Verify token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
```

**Test it:**
```javascript
// Add to bottom of file temporarily
const token = generateAccessToken('test123', 'test@example.com');
console.log('Generated token:', token);
const decoded = verifyToken(token);
console.log('Decoded:', decoded);
```

---

#### ✅ Task 1.5: Create Auth Middleware

**File:** `Server/endpoints/pdfanswer/middleware/auth.js`

```javascript
import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware to verify JWT token
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };
    }

    next();
  } catch (error) {
    // Continue without user info
    next();
  }
};
```

---

### Day 5-6: Auth Controller & Routes

#### ✅ Task 1.6: Create Auth Controller

**File:** `Server/endpoints/pdfanswer/controllers/authController.js`

```javascript
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';

// Temporary in-memory user storage (replace with database in Phase 3)
const users = new Map();

/**
 * Register new user
 */
export const register = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userId = `user_${Date.now()}`;
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      isActive: true
    };

    users.set(email, user);

    // Generate tokens
    const accessToken = generateAccessToken(userId, email);
    const refreshToken = generateRefreshToken(userId);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: userId,
          email,
          name,
          createdAt: user.createdAt
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate tokens
    const accessToken = generateAccessToken(user.id, email);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          lastLogin: user.lastLogin
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * Get user profile
 */
export const getProfile = async (req, res) => {
  try {
    const { email } = req.user;

    const user = users.get(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    // Find user
    const user = Array.from(users.values()).find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.email);

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({
      success: false,
      message: 'Invalid refresh token',
      error: error.message
    });
  }
};

/**
 * Logout user (client-side token removal)
 */
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
};
```

---

#### ✅ Task 1.7: Create Auth Routes

**File:** `Server/endpoints/pdfanswer/routes/auth.js`

```javascript
import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, refreshToken, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty()
], register);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], login);

/**
 * @route   GET /auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', refreshToken);

/**
 * @route   POST /auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

export default router;
```

---

#### ✅ Task 1.8: Update Main Server

**File:** `Server/endpoints/pdfanswer/mainServer.js`

**Add these imports at the top:**
```javascript
import authRoutes from './routes/auth.js';
```

**Add this route (after other routes, before error handlers):**
```javascript
// Auth routes
app.use('/auth', authRoutes);
```

**Full updated section should look like:**
```javascript
// Routes
app.use('/pdf', pdfRouter);
app.use('/quiz', quizRouter);
app.use('/flashcards', flashcardsRouter);
app.use('/roadmap', roadmapRouter);
app.use('/img', finalRouter);
app.use('/auth', authRoutes); // 👈 ADD THIS LINE
```

---

### Day 7: Testing Backend

#### ✅ Task 1.9: Test Auth Endpoints

**Start the server:**
```bash
cd Server/endpoints/pdfanswer
node mainServer.js
```

**Test with curl or Postman:**

**1. Register:**
```bash
curl -X POST http://localhost:3005/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_1234567890",
      "email": "test@example.com",
      "name": "Test User",
      "createdAt": "2026-01-21T..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**2. Login:**
```bash
curl -X POST http://localhost:3005/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**3. Get Profile (use token from login):**
```bash
curl -X GET http://localhost:3005/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**4. Refresh Token:**
```bash
curl -X POST http://localhost:3005/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

---

#### ✅ Task 1.10: Protect Existing Routes (Optional)

**Example: Protect quiz generation**

**File:** `Server/endpoints/pdfanswer/quiz.js`

```javascript
import { authenticateToken } from './middleware/auth.js';

// Add middleware to route
router.post('/', authenticateToken, async (req, res) => {
  // Now req.user contains { userId, email }
  // ... existing code
});
```

**Do this for:**
- [ ] `/quiz` - Quiz generation
- [ ] `/flashcards` - Flashcard generation
- [ ] `/roadmap` - Roadmap generation
- [ ] `/img` - Content generation
- [ ] `/pdf/*` - PDF operations

---

## 🎯 WEEK 2: Frontend Authentication

### Day 8-9: Context & Services

#### ✅ Task 2.1: Create Directory Structure

```bash
cd frontend/src
mkdir contexts
mkdir components/auth
mkdir hooks
```

---

#### ✅ Task 2.2: Create Auth Service

**File:** `frontend/src/services/authService.js`

```javascript
import apiClient from '../config/api';

class AuthService {
  /**
   * Register new user
   */
  async register(email, password, name) {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      name
    });
    return response.data;
  }

  /**
   * Login user
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
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Get user profile
   */
  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }

  /**
   * Refresh access token
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
   * Set tokens in localStorage
   */
  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Set access token
   */
  setAccessToken(accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  /**
   * Get access token
   */
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  /**
   * Get refresh token
   */
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Set user data
   */
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Get user data
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Clear all auth data
   */
  clearAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  }
}

export default new AuthService();
```

---

#### ✅ Task 2.3: Update API Config

**File:** `frontend/src/config/api.js`

**Add token interceptor:**

```javascript
import axios from 'axios';
import authService from '../services/authService';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3005',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authService.refreshToken();
        const newToken = authService.getAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        authService.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

---

#### ✅ Task 2.4: Create Auth Context

**File:** `frontend/src/contexts/AuthContext.jsx`

```javascript
import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

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
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = async (email, password, name) => {
    try {
      const response = await authService.register(email, password, name);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

### Day 10-11: Auth Components

#### ✅ Task 2.5: Create Login Component

**File:** `frontend/src/components/auth/Login.jsx`

```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.warning('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Welcome Back
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-white/60 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

---

#### ✅ Task 2.6: Create Register Component

**File:** `frontend/src/components/auth/Register.jsx`

```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.warning('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.warning('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const result = await register(formData.email, formData.password, formData.name);
      
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Create Account
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="text-white/60 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
```

---

#### ✅ Task 2.7: Create Protected Route Component

**File:** `frontend/src/components/auth/ProtectedRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullscreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

---

### Day 12-13: Integration

#### ✅ Task 2.8: Update App.jsx

**File:** `frontend/src/App.jsx`

```javascript
import { Home } from './components/home/Home';
import { Header } from './components/header/Header';
import { Learn } from './components/learn/Learn';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Quiz } from './components/quiz/Quiz';
import Pdf from './components/pdf';
import Flashcards from './components/Flashcards';
import Roadmap from './components/Roadmap';
import Dashboard from './components/dashboard/Dashboard';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import "./index.css"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          
          {/* Protected routes */}
          <Route path='/' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path='/home' element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path='/learn' element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          } />
          <Route path="/pdf" element={
            <ProtectedRoute>
              <Pdf />
            </ProtectedRoute>
          } />
          <Route path='/quiz' element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } />
          <Route path='/flashcards' element={
            <ProtectedRoute>
              <Flashcards />
            </ProtectedRoute>
          } />
          <Route path='/roadmap' element={
            <ProtectedRoute>
              <Roadmap />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
```

---

#### ✅ Task 2.9: Update main.jsx

**File:** `frontend/src/main.jsx`

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
```

---

#### ✅ Task 2.10: Update Header Component

**File:** `frontend/src/components/header/Header.jsx`

**Add logout button and user info:**

```javascript
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header>
      {/* ... existing header content ... */}
      
      {isAuthenticated && (
        <div className="user-section">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
};
```

---

## 🎯 WEEK 3: Testing & Polish

### Day 14: Testing

#### ✅ Task 3.1: Manual Testing Checklist

**Backend:**
- [ ] Register with valid data → Success
- [ ] Register with existing email → Error
- [ ] Register with invalid email → Error
- [ ] Register with short password → Error
- [ ] Login with valid credentials → Success
- [ ] Login with wrong password → Error
- [ ] Login with non-existent email → Error
- [ ] Get profile with valid token → Success
- [ ] Get profile with invalid token → Error
- [ ] Get profile without token → Error
- [ ] Refresh token with valid refresh token → Success
- [ ] Refresh token with invalid token → Error

**Frontend:**
- [ ] Register form validation works
- [ ] Register redirects to dashboard on success
- [ ] Login form validation works
- [ ] Login redirects to dashboard on success
- [ ] Protected routes redirect to login when not authenticated
- [ ] Protected routes accessible when authenticated
- [ ] Logout clears session and redirects to login
- [ ] Token refresh happens automatically on 401
- [ ] User info persists on page refresh

---

#### ✅ Task 3.2: Fix Any Bugs

Document and fix any issues found during testing.

---

#### ✅ Task 3.3: Error Handling Review

- [ ] All API errors show user-friendly messages
- [ ] Network errors handled gracefully
- [ ] Loading states shown during async operations
- [ ] Form validation prevents invalid submissions

---

### Day 15: Documentation

#### ✅ Task 3.4: Update API Documentation

Create `API_DOCUMENTATION.md` with auth endpoints.

---

#### ✅ Task 3.5: Update README

Add authentication setup instructions to README.

---

#### ✅ Task 3.6: Code Comments

Add JSDoc comments to all functions.

---

## ✅ COMPLETION CHECKLIST

### Backend (10/10)
- [ ] JWT utilities created
- [ ] Auth middleware created
- [ ] Auth controller created
- [ ] Auth routes created
- [ ] Main server updated
- [ ] Environment variables configured
- [ ] Password hashing implemented
- [ ] Token refresh implemented
- [ ] Input validation added
- [ ] All endpoints tested

### Frontend (10/10)
- [ ] Auth service created
- [ ] Auth context created
- [ ] Login component created
- [ ] Register component created
- [ ] Protected route component created
- [ ] App.jsx updated with routes
- [ ] main.jsx updated with providers
- [ ] Header updated with logout
- [ ] API config updated with interceptors
- [ ] All flows tested

### Testing (5/5)
- [ ] Manual testing completed
- [ ] All bugs fixed
- [ ] Error handling verified
- [ ] User experience polished
- [ ] Edge cases handled

### Documentation (3/3)
- [ ] API documentation updated
- [ ] README updated
- [ ] Code comments added

---

## 🎉 SUCCESS CRITERIA

Phase 2 is complete when:
- ✅ Users can register with email/password
- ✅ Users can login and receive JWT token
- ✅ Token automatically included in API requests
- ✅ Protected routes redirect to login when not authenticated
- ✅ Token refresh works automatically
- ✅ Logout clears session properly
- ✅ User session persists on page refresh
- ✅ All error cases handled gracefully
- ✅ Code is documented
- ✅ No console errors

---

## 🚀 NEXT STEPS

After completing Phase 2:
1. Move to **Phase 3: Database Integration**
2. Replace in-memory user storage with MongoDB/PostgreSQL
3. Add user data persistence
4. Implement progress tracking

---

**Ready to start? Begin with Week 1, Day 1! 🔥**

**Estimated Time:** 2-3 weeks  
**Your Progress:** 0% → Let's make it 100%! 💪
