# 📚 Library Portal

A **full-stack web application** for managing a library system.  
Built with **React** on the frontend and **Express + SQLite** on the backend.  

It allows users to:
- Perform full CRUD operations on **Books** and **Students**
- Handle **Borrowings** with rules:
  - Max 3 active borrowings per student
  - 30-day due dates
  - Automatic update of book copies

---

## 🚀 Tech Stack
- **Frontend:** React, Vite, TailwindCSS  
- **Backend:** Node.js, Express  
- **Database:** SQLite  

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/LitoKarageorgou/library-portal.git
cd library-portal
```

### 2. Start the backend
```bash
cd backend
npm install
node server.js
```
👉 Runs on [http://localhost:3001](http://localhost:3001)

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
👉 Runs on [http://localhost:5173](http://localhost:5173)

### 4. Environment Variables
#### An `.env` file is already included for convenience.  
---

## 📸 Preview
![Homepage](./screenshots/homepage.png)
![Books](./screenshots/books.png)
![Students](./screenshots/students.png)
![Borrowings](./screenshots/borrowings.png) 

---

## 🖼️ Assets
The icons used in this project are from [Flaticon](https://www.flaticon.com/) and are included for demonstration purposes only.
