# 🔐 Authentication API Testing Guide

This guide provides curl commands and instructions for testing the Dyano Authentication API.

## 🚀 Quick Setup

1. **Base URL:** `http://localhost:3005`
2. **Server:** Ensure the server is running (`npm run dev` in `Server/endpoints/pdfanswer`)

---

## 📝 Endpoints

### 1. Register a New User
**Endpoint:** `POST /auth/register`

```bash
curl -X POST http://localhost:3005/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### 2. Login
**Endpoint:** `POST /auth/login`

```bash
curl -X POST http://localhost:3005/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```
*Response will include `accessToken` and `refreshToken`.*

### 3. Get User Profile (Protected)
**Endpoint:** `GET /auth/profile`

```bash
curl -X GET http://localhost:3005/auth/profile \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### 4. Refresh Token
**Endpoint:** `POST /auth/refresh`

```bash
curl -X POST http://localhost:3005/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<YOUR_REFRESH_TOKEN>"
  }'
```

### 5. Logout (Protected)
**Endpoint:** `POST /auth/logout`

```bash
curl -X POST http://localhost:3005/auth/logout \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### 6. List All Users (Dev Only)
**Endpoint:** `GET /auth/users`

```bash
curl -X GET http://localhost:3005/auth/users
```

---

## 🧪 Common Test Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Register with existing email | `400 Bad Request` |
| Invalid email format | `400 Bad Request` |
| Password < 6 chars | `400 Bad Request` |
| Wrong login credentials | `401 Unauthorized` |
| Missing Token on Profile | `401 Unauthorized` |
| Expired Access Token | `401 Unauthorized` |

---

## 🛠 Troubleshooting

- **CORS Error:** Ensure your frontend URL is in the whitelist in `mainServer.js`.
- **JWT Errors:** Check `JWT_SECRET` in `.env`.
- **Validation Errors:** Check the server logs for specific validation messages.

---

*Dyano Team - 2026*
