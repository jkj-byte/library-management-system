# 📚 Library Management System

A secure full-stack Library Management System that allows users to manage their personal book collection with authentication and strict access control.

Built using **FastAPI**, **Supabase**, and **React (Vite)**.

---

## ✨ Features

- User authentication using Supabase (Email & Password)
- Add new books with title, author, and reading status
- View personal book list (latest added first)
- Search books by title
- Update reading status:
  - Reading
  - Completed
  - Plan-to-Read
- Delete books (user-owned only)
- Total book count display

---

## 🔐 Security & Access Control

- Supabase **Row Level Security (RLS)** enabled
- Each user can only:
  - View their own books
  - Update their own books
  - Delete their own books
- JWT-based authentication
- Backend uses **Supabase anon key + user JWT**
- No service role key exposed

---

## 🧰 Tech Stack

### Frontend
- React (Vite)

### Backend
- FastAPI
- Supabase Python SDK

### Database
- Supabase PostgreSQL
- Row Level Security (RLS)

---

## ▶️ How to Run the Project

### Backend

cd backend

uvicorn app.main:app --reload



### Frontend:

cd frontend

npm install

npm run dev



---
## 📌 User Scope Guarantee

- A user **cannot see another user's books**
- A user **cannot update or delete another user's books**
- All access control is enforced using **RLS + JWT**


---

\## Author

Joel K Joseph





