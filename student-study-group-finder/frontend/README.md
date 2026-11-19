# Student Study Group Finder - Frontend

**Uganda Christian University**  
Faculty of Engineering, Design and Technology  
Department of Computing and Technology

## Overview

React-based responsive web application for discovering, creating, and managing student study groups.

## Tech Stack

- **React 18** + Vite
- **React Router** for navigation
- **Axios** for API calls
- Custom CSS (clean, responsive design)

## Features

- User registration & login
- Browse / search study groups
- Create and join groups
- Schedule study sessions
- Group posts & announcements
- Personal dashboard (my groups + upcoming sessions)
- Fully responsive (desktop + mobile)

## Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Environment (optional)

Create a `.env` file if your backend is not on `localhost:5000`:

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run development server

```bash
npm run dev
```

App will be available at `http://localhost:3000`

### 4. Build for production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Groups.jsx
│   │   ├── GroupDetail.jsx
│   │   └── CreateGroup.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Notes for Assessment

- Clean component structure
- JWT authentication handled via context
- Responsive design
- Error handling on forms
- Clear user flows for demo
