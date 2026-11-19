# Student Study Group Finder

**Uganda Christian University**  
Faculty of Engineering, Design and Technology  
Department of Computing and Technology  

**Web and Mobile Application Development Group Assignment**

---

## Project Overview

A web-based platform that allows students to:

- Create study groups for specific courses
- Discover and join existing groups
- Schedule study sessions
- Communicate via group posts/announcements
- View personal dashboards of their groups and upcoming sessions

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React (Vite)            |
| Backend   | Node.js + Express       |
| Database  | MongoDB + Mongoose     |
| Auth      | JWT + bcrypt            |

## Repository Structure

This is a monorepo containing both parts:

```
student-study-group-finder/
├── backend/          → Express API
└── frontend/         → React application
```

**For the assignment you should create two separate GitHub repositories:**

1. **Frontend repository** → push the contents of the `frontend/` folder  
2. **Backend repository** → push the contents of the `backend/` folder  

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000  
Backend API: http://localhost:5000

## Main Features Implemented (MVP)

- ✅ User registration & JWT login
- ✅ Create / search / join study groups
- ✅ Group leader management
- ✅ Study session scheduling
- ✅ Group posts (announcements, questions, general)
- ✅ Student dashboard (my groups + upcoming sessions)
- ✅ Responsive design (desktop + mobile)
- ✅ Input validation & error handling

## Authors

Students of Uganda Christian University  
Department of Computing and Technology

---

*This project was developed as part of the Web and Mobile Application Development group assignment.*
