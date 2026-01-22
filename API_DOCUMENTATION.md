# 📚 **DYANO API DOCUMENTATION**

**Base URL:** `http://localhost:3005` (Development)  
**Production URL:** TBD  
**Version:** 1.0.0

---

## 🔐 **Authentication**

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### **Rate Limits:**
- **Auth endpoints:** 5 requests / 15 minutes
- **AI endpoints:** 20 requests / hour
- **General API:** 100 requests / 15 minutes

---

## 📋 **ENDPOINTS**

### **1. Authentication (`/auth`)**

#### **POST /auth/register**
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2026-01-21T..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### **POST /auth/login**
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### **GET /auth/profile**
Get current user profile. 🔒 Protected

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```

#### **POST /auth/refresh**
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token"
  }
}
```

---

### **2. Progress Tracking (`/progress`)**

#### **GET /progress**
Get user progress and statistics. 🔒 Protected

**Response (200):**
```json
{
  "success": true,
  "data": {
    "progress": {
      "dailyStreak": {
        "count": 5,
        "lastActivityDate": "2026-01-21T..."
      },
      "stats": {
        "totalQuizzesTaken": 10,
        "averageScore": 85,
        "totalFlashcardsLearned": 50,
        "studyTimeMinutes": 120
      },
      "achievements": [
        { "name": "first_quiz", "unlockedAt": "..." }
      ]
    },
    "breakdown": {
      "quizzes": { "total": 10, "completed": 8, "averageScore": 85 },
      "flashcards": { "sets": 5, "totalCards": 50 },
      "roadmaps": { "total": 3, "completed": 1 }
    }
  }
}
```

#### **POST /progress/update**
Update user progress. 🔒 Protected

**Request Body:**
```json
{
  "studyTimeMinutes": 30,
  "achievement": "week_streak"
}
```

#### **GET /progress/achievements**
Get all achievements. 🔒 Protected

---

### **3. Quiz Generation (`/quiz`)**

#### **POST /quiz**
Generate a new quiz. 🔒 Protected | 🤖 AI Rate Limited

**Request Body:**
```json
{
  "prompt": "JavaScript basics",
  "difficulty": "medium"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Quiz generated and saved",
  "quiz": {
    "_id": "quiz_id",
    "title": "Quiz: JavaScript basics",
    "topic": "JavaScript basics",
    "difficulty": "medium",
    "questions": [
      {
        "questionText": "What is a closure?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "A",
        "explanation": "..."
      }
    ],
    "totalQuestions": 5
  }
}
```

#### **GET /quiz**
Get all user quizzes. 🔒 Protected

**Response (200):**
```json
{
  "success": true,
  "quizzes": [ ... ]
}
```

---

### **4. Flashcards (`/flashcards`)**

#### **POST /flashcards**
Generate flashcard set. 🔒 Protected | 🤖 AI Rate Limited

**Request Body:**
```json
{
  "prompt": "Python data structures"
}
```

**Response (201):**
```json
{
  "success": true,
  "flashcards": {
    "_id": "set_id",
    "title": "Flashcards: Python data structures",
    "cards": [
      {
        "front": "List",
        "back": "Ordered, mutable collection",
        "difficulty": 0,
        "nextReview": "2026-01-22T..."
      }
    ]
  }
}
```

#### **GET /flashcards**
Get all flashcard sets. 🔒 Protected

#### **GET /flashcards/:setId/due**
Get cards due for review. 🔒 Protected

**Response (200):**
```json
{
  "success": true,
  "dueCards": [ ... ],
  "stats": {
    "total": 20,
    "due": 5,
    "mastered": 10,
    "learning": 8,
    "new": 2
  }
}
```

#### **POST /flashcards/:setId/review**
Review a flashcard. 🔒 Protected

**Request Body:**
```json
{
  "cardIndex": 0,
  "quality": 4
}
```
**Quality Scale:** 0-5 (0=blackout, 5=perfect)

**Response (200):**
```json
{
  "success": true,
  "nextReview": "2026-01-28T...",
  "difficulty": 3,
  "interval": 7
}
```

---

### **5. Roadmaps (`/roadmap`)**

#### **POST /roadmap**
Generate learning roadmap. 🔒 Protected | 🤖 AI Rate Limited

**Request Body:**
```json
{
  "prompt": "Machine Learning"
}
```

**Response (201):**
```json
{
  "success": true,
  "roadmap": {
    "_id": "roadmap_id",
    "title": "Master Machine Learning",
    "goal": "Become proficient in ML",
    "steps": [
      {
        "title": "Python Basics",
        "description": "Learn Python fundamentals",
        "order": 1,
        "completed": false
      }
    ]
  }
}
```

#### **GET /roadmap**
Get all roadmaps. 🔒 Protected

---

### **6. PDF Processing (`/pdf`)**

#### **POST /pdf/upload**
Upload and process PDF. 🔒 Protected

**Request:**
- Content-Type: `multipart/form-data`
- Field: `pdfFile` (PDF file, max 10MB)

**Response (201):**
```json
{
  "success": true,
  "message": "PDF uploaded and processed",
  "documentId": "doc_id",
  "fileName": "document.pdf"
}
```

#### **POST /pdf/question**
Ask question about PDF. 🔒 Protected

**Request Body:**
```json
{
  "documentId": "doc_id",
  "question": "What is the main topic?"
}
```

**Response (200):**
```json
{
  "success": true,
  "answer": "The main topic is..."
}
```

#### **GET /pdf/list**
Get all user PDFs. 🔒 Protected

---

## ⚠️ **ERROR RESPONSES**

### **400 Bad Request**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [ ... ]
}
```

### **401 Unauthorized**
```json
{
  "success": false,
  "message": "Access token required"
}
```

### **403 Forbidden**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### **404 Not Found**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### **429 Too Many Requests**
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

### **500 Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔒 **Security**

- **Authentication:** JWT with refresh tokens
- **Password Hashing:** bcrypt (10 rounds)
- **Rate Limiting:** Per endpoint
- **CORS:** Configured for frontend origin
- **Helmet:** Security headers
- **Request Size:** Limited to 10MB

---

## 📊 **Response Format**

All responses follow this structure:
```json
{
  "success": true/false,
  "message": "Human-readable message",
  "data": { ... } // or "error": "..."
}
```

---

## 🚀 **Getting Started**

1. Register a new account: `POST /auth/register`
2. Login to get tokens: `POST /auth/login`
3. Use access token in Authorization header
4. Start using AI features!

---

**Last Updated:** January 21, 2026  
**Version:** 1.0.0
