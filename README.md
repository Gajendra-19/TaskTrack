# TaskTrack 

A productivity-focused **task management application** that enables users to create and manage tasks through a clean, user-friendly interface — helping individuals stay organized and on top of their work.

🔗 **Live Demo:** 
(https://tasktrackapp-one.vercel.app/)


---

## 🔗 Features

- **User Authentication** — Secure register & login with JWT-based auth
- **Task CRUD** — Create, read, update, and delete tasks with ease
- **Task Status Tracking** — Organize tasks into `Pending`, `In Progress`, and `Completed` states
- **Quick Status Update** — Cycle through task statuses directly from the Task Report panel
- **Search & Filter** — Search tasks by title and filter by status in real time
- **Task Statistics Dashboard** — At-a-glance counts for total, completed, in-progress, and pending tasks
- **Dark / Light Mode** — Toggle between themes; preference is saved across sessions
- **Responsive Design** — Mobile bottom navigation bar for small screens
- **Toast Notifications** — Instant feedback for all actions via react-toastify

---

## 🔗 Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Frontend      | React 19, React Router DOM v7       |
| Build         | Vite                                |
| HTTP Client   | Axios                               |
| Notifications | React Toastify                      |
| Backend       | Node.js, Express 5                  |
| Database      | MongoDB, Mongoose                   |
| Auth          | JWT (jsonwebtoken), bcryptjs        |
| Dev Server    | Nodemon                             |
| Deployment    | Vercel (frontend)                   |

---

## 📁 Project Structure

```
TaskTrack/
├── Backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register & login logic
│   │   └── taskController.js     # CRUD task logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Task.js               # Task schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── taskRoutes.js         # /api/tasks routes
│   ├── server.js                 # Express app entry point
│   └── package.json
└── frontend/
    ├── public/
    │   └── icon.png
    ├── src/
    │   ├── assets/               # Images, SVGs
    │   ├── components/           # Reusable UI (Navbar, TaskList, TaskForm)
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── pages/
    │   │   ├── login.jsx
    │   │   ├── register.jsx
    │   │   └── dashboard.jsx     # Main app view
    │   ├── services/
    │   │   └── api.js            # Axios instance + auth & task services
    │   ├── App.jsx               # Routes + protected/public route guards
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── vercel.json
```

---

## 🔗 Getting Started

### Prerequisites

- Node.js >= 18
- A running backend API (default: `http://localhost:5000/api`)

### Installation

```bash
# Clone the repository
git clone https://github.com/Gajendra-19/TaskTrack.git
cd TaskTrack/frontend

# Install dependencies
npm install
```

### Environment Variables

**Frontend** — create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** — create a `.env` file in the `Backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Running Locally

**Backend:**
```bash
cd Backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
cd frontend
npm run build
```

---

## 🔗 API Endpoints

The frontend communicates with the backend via the following endpoints:

### Auth

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login & get token   |

### Tasks *(requires Bearer token)*

| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| GET    | `/api/tasks`      | Get all user tasks  |
| GET    | `/api/tasks/:id`  | Get task by ID      |
| POST   | `/api/tasks`      | Create a new task   |
| PUT    | `/api/tasks/:id`  | Update a task       |
| DELETE | `/api/tasks/:id`  | Delete a task       |

---

## 🔗 Pages & Routing

| Route        | Access     | Description                          |
|--------------|------------|--------------------------------------|
| `/`          | Public     | Redirects to `/dashboard`            |
| `/login`     | Public only| Login page (redirects if logged in)  |
| `/register`  | Public only| Registration page                    |
| `/dashboard` | Protected  | Main task management view            |

---


## 👤 Author

**Gajendra** — [@Gajendra-19]

