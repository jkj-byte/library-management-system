# 📚 Library Management System

A secure full-stack Library Management System that allows users to manage their personal book collection with authentication and strict access control.

Built using **FastAPI**, **Supabase**, and **React (Vite)**.

---

## ✨ Features

- User authentication (Email & Password)
- Add books with title, author, and reading status
- View personal book list (latest added first)
- Search books by title
- Update reading status:
  - Reading
  - Completed
  - Plan-to-Read
- Delete books (user-owned only)
- Display total book count
- Clean and responsive UI

---

## 🧰 Tech Stack

### Frontend
- React (Vite)

### Backend
- FastAPI

### Database
- Supabase PostgreSQL

**Why Supabase Postgres?**
- Built-in authentication
- Native Row Level Security (RLS)
- Secure, user-scoped data access
- SQL-based relational consistency

---

## 🔐 Authentication Method

- Supabase Auth (Email & Password)
- Supabase issues a JWT access token on login
- JWT is stored in browser localStorage
- JWT is sent with every API request in headers

---

## 🔒 Security & Access Control

- Supabase Row Level Security (RLS) enabled
- Backend uses Supabase anon key + user JWT
- No service role key is exposed

**Guarantees:**
- Users can only view their own books
- Users can only update or delete their own books
- Access control enforced at database level

---

## 📌 User Scope Guarantee

- A user cannot see another user's books
- A user cannot modify another user's books
- Enforced using RLS + JWT authentication

---

## 🗂️ Database Schema

### books table

| Column      | Type      | Description |
|------------|-----------|-------------|
| id         | uuid      | Primary key |
| title      | text      | Book title |
| author     | text      | Book author |
| status     | text      | Reading / Completed / Plan-to-Read |
| user_id    | uuid      | References auth.users(id) |
| created_at | timestamp | Auto-generated |

---

## ▶️ How to Run the Project Locally

### Backend

cd backend
uvicorn app.main:app --reload

Backend runs at:

http://127.0.0.1:8000

Frontend
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

---

🔑 Environment Variables:

Backend (.env.example):

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

Frontend (.env.example):

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

---

🧠 JWT Validation (Short Explanation)

1. User logs in using Supabase Auth

2. Supabase returns a JWT access token

3. Frontend sends JWT in Authorization header

4. Backend validates JWT using Supabase

5. Supabase RLS enforces user-level access

---

📡 Example API Request:

Get User Books:

Request:

GET /api/books


Headers:

Authorization: Bearer <JWT_ACCESS_TOKEN>


Response

{
  "total": 2,
  "books": [
    {
      "id": "uuid",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "status": "Reading",
      "created_at": "2024-01-01T10:00:00"
    }
  ]
}

---

👤 Author

Joel K Joseph