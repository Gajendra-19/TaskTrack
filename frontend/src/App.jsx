import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import './App.css'
import { Analytics } from '@vercel/analytics/react'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />
}

function AppContent() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Analytics />
      </AuthProvider>
    </Router>
  )
}

export default App