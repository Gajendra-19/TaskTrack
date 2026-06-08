# TaskTrack 📋

A productivity-focused **task management application** that enables users to create and manage tasks through a clean, user-friendly interface — helping individuals stay organized and on top of their work.

🔗 **Live Demo:** [tasktrack-2vgabxhxd-gajendra-choudhary-s-projects.vercel.app](https://tasktrack-2vgabxhxd-gajendra-choudhary-s-projects.vercel.app)

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

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, React Router DOM v7       |
| Build     | Vite                                |
| HTTP      | Axios                               |
| Notifications | React Toastify                  |
| Auth      | JWT (stored in localStorage)        |
| Backend   | Node.js / Express (separate service)|
| Deployment| Vercel (frontend)                   |

---

## 📁 Project Structure

```
TaskTrack/
└── frontend/
    ├── public/
    │   └── icon.png
    ├── src/
    │   ├── assets/          # Images, SVGs
    │   ├── components/      # Reusable UI (Navbar, TaskList, TaskForm)
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

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

> Replace the URL with your deployed backend URL when deploying to production.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

---

## 📡 API Endpoints

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

**Gajendra** — [@Gajendra-19](https://github.com/Gajendra-19)

---
