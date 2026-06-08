# Task Manager - MERN Stack Application

A full-stack task management web application built with MongoDB, Express, React, and Node.js (MERN stack).

## Features

- **User Authentication**: Register and login with secure password hashing
- **Task Management**: Create, read, update, and delete tasks
- **Task Status Tracking**: Track task status (pending, in-progress, completed)
- **Responsive Design**: Works on desktop and mobile devices
- **JWT Authentication**: Secure API endpoints with JWT tokens
- **User-specific Tasks**: Each user can only see and manage their own tasks

## Tech Stack

### Backend
- **Node.js** & **Express** - Server and API
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management

## Project Structure

```
TaskManager/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TaskForm.jsx
    │   │   └── TaskList.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── dashboard.jsx
    │   │   ├── login.jsx
    │   │   └── register.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to the Backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration:
   ```
   MONGO_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  - Body: `{ name, email, password }`
  - Returns: `{ token, user }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

### Tasks (Protected - require Bearer token)
- `POST /api/tasks` - Create a new task
  - Body: `{ title, description, status }`
  - Returns: `{ task }`

- `GET /api/tasks` - Get all tasks for the user
  - Returns: `{ tasks: [] }`

- `GET /api/tasks/:id` - Get a specific task
  - Returns: `{ task }`

- `PUT /api/tasks/:id` - Update a task
  - Body: `{ title, description, status }`
  - Returns: `{ task }`

- `DELETE /api/tasks/:id` - Delete a task
  - Returns: `{ message }`

## Authentication

- The application uses JWT (JSON Web Tokens) for authentication
- After login/register, the token is stored in localStorage
- The token is automatically attached to all API requests via the `Authorization` header
- Protected routes redirect unauthenticated users to the login page

## Usage

1. **Register**: Create a new account with your email and password
2. **Login**: Use your credentials to log in
3. **Dashboard**: 
   - View all your tasks
   - Create new tasks with title, description, and status
   - Edit task details
   - Mark tasks as completed, in-progress, or pending
   - Delete tasks

## Error Handling

- The application includes error handling for:
  - Invalid credentials
  - Duplicate email registration
  - Missing required fields
  - Unauthorized access to tasks
  - Network errors

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens are used for stateless authentication
- CORS is configured for the frontend domain
- Protected routes ensure only authenticated users can access tasks

## Troubleshooting

### Backend won't connect to MongoDB
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Verify database credentials if using MongoDB Atlas

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend .env file
- Check browser console for CORS errors

### Login not working
- Verify credentials are correct
- Check backend server is running
- Check network tab in browser dev tools

## Future Enhancements

- Task filtering and sorting
- Due dates and reminders
- Task categories/tags
- Collaborative tasks
- Task priority levels
- Email notifications
- Dark mode
- Mobile app

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.
