# Student Study Group Finder - Backend API

**Uganda Christian University**  
Faculty of Engineering, Design and Technology  
Department of Computing and Technology

## Overview

RESTful API for the Student Study Group Finder platform. Supports user authentication, study group management, session scheduling, and group communication.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **Validation**: express-validator

## Features

- User registration & login with JWT
- Create, search, join, and manage study groups
- Schedule study sessions
- Group posts / announcements
- Role-based access (student / leader / admin)

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas free tier)

### 2. Installation

```bash
cd backend
npm install
```

### 3. Environment Variables

Copy the example file and edit:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studygroupfinder
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studygroupfinder
JWT_SECRET=replace_with_a_long_random_string
NODE_ENV=development
```

### 4. Run the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new student |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (protected) |

### Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groups` | List/search groups |
| GET | `/api/groups/:id` | Get single group |
| POST | `/api/groups` | Create group (protected) |
| POST | `/api/groups/:id/join` | Join group (protected) |
| PUT | `/api/groups/:id` | Update group (leader only) |
| GET | `/api/groups/my/groups` | My groups (protected) |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions/group/:groupId` | Sessions for a group |
| GET | `/api/sessions/my` | My upcoming sessions |
| POST | `/api/sessions` | Create session (protected) |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/group/:groupId` | Posts in a group |
| POST | `/api/posts` | Create post (protected) |

## Project Structure

```
backend/
├── models/
│   ├── User.js
│   ├── Group.js
│   ├── Session.js
│   └── Post.js
├── routes/
│   ├── auth.js
│   ├── groups.js
│   ├── sessions.js
│   └── posts.js
├── middleware/
│   └── auth.js
├── server.js
├── package.json
└── .env.example
```

## Notes for Assessment

- Clean, modular code structure
- Input validation on all write endpoints
- JWT-based authentication
- Proper error handling
- Git commits should show collaborative work
