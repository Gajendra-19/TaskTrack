import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';
import logoIcon from '../assets/icon_img.png';
import './dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });

  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch tasks on component mount
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskService.getTasks();
      setTasks(response.data.tasks || []);
      if (response.data.tasks?.length > 0) {
        setSelectedTask(response.data.tasks[0]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tasks', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskData.title.trim()) {
      toast.error('Task title is required', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await taskService.createTask(
        newTaskData.title,
        newTaskData.description,
        newTaskData.status
      );
      setTasks([response.data.task, ...tasks]);
      toast.success('Task created successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setNewTaskData({
        title: '',
        description: '',
        status: 'pending',
      });
      setShowAddTaskModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await taskService.updateTask(id, updatedData);
      const updated = response.data.task;
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
      if (selectedTask?._id === id) {
        setSelectedTask(updated);
      }
      toast.success('Task updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setShowEditModal(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setNewTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!newTaskData.title.trim()) {
      toast.error('Task title is required', {
        position: 'top-right',
        autoClose: 2000,
      });
      return;
    }
    await handleUpdateTask(editingTask._id, newTaskData);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await taskService.deleteTask(id);
        setTasks(tasks.filter((t) => t._id !== id));
        if (selectedTask?._id === id) {
          setSelectedTask(tasks.find((t) => t._id !== id) || null);
        }
        toast.success('Task deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete task', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter tasks based on status and search query
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'badge-completed';
      case 'in-progress':
        return 'badge-in-progress';
      case 'pending':
        return 'badge-pending';
      default:
        return 'badge-pending';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logoIcon} alt="TaskTrack Logo" width="32" height="32" />
            <span>TaskTrack</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h2m16 0h2M3 6h2m16 0h2M3 18h2m16 0h2M5 3v2m14 0v-2M5 21v-2m14 0v2M9 3h6v18H9z"></path>
            </svg>
            <span>Dashboard</span>
          </a>
          <a href="#add" className="nav-item" onClick={() => setShowAddTaskModal(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v8M8 12h8"></path>
            </svg>
            <span>Add Task</span>
          </a>
          <button 
            className="nav-item" 
            onClick={() => {
              const newDarkMode = !darkMode;
              setDarkMode(newDarkMode);
              document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
              localStorage.setItem('darkMode', newDarkMode.toString());
            }}
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <span>Light</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <span>Dark</span>
              </>
            )}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <div className="user-info">
              <p className="user-name">{user?.name || 'User'}</p>
              <p className="user-email">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg> LogOut
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Section */}
        <div className="dashboard-top">
          <div className="top-header">
            <div className="welcome-section">
              <h1>Welcome, {user?.name?.split(' ')[0]}! </h1>
              <p>Here's your tasks </p>
            </div>
            <div className="top-actions">
              <div className="search-bar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="btn-add-task"
                onClick={() => setShowAddTaskModal(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v8M8 12h8"></path>
                </svg>
                Add Task
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon total-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Tasks</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon completed-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Completed</p>
                <p className="stat-value">{stats.completed}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon progress-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="1"></circle>
                  <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m2.12-2.12l4.24-4.24"></path>
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">In Progress</p>
                <p className="stat-value">{stats.inProgress}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 7v5l3 3"></path>
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Pending</p>
                <p className="stat-value">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - 2 Column Layout */}
        <div className="content-area">
          {/* Left Side - Task List (70%) */}
          <div className="tasks-panel">
            {/* Status Tabs */}
            <div className="status-tabs">
              <button
                className={`tab ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                className={`tab ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`tab ${statusFilter === 'in-progress' ? 'active' : ''}`}
                onClick={() => setStatusFilter('in-progress')}
              >
                In Progress
              </button>
              <button
                className={`tab ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </button>
            </div>

            {/* Task List Table */}
            <div className="task-list-table">
              {loading && filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="1"></circle>
                    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m2.12-2.12l4.24-4.24"></path>
                  </svg>
                  <p>Loading tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12h6m-6 4h6M9 8h6m3 5a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p>No tasks found. Create one to get started! 🚀</p>
                </div>
              ) : (
                <table className="task-table">
                  <thead>
                    <tr>
                      <th>Task Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr
                        key={task._id}
                        className={`task-row ${selectedTask?._id === task._id ? 'active' : ''}`}
                        onClick={() => setSelectedTask(task)}
                      >
                        <td className="task-name">{task.title}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                            {task.status === 'in-progress'
                              ? 'In Progress'
                              : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </td>
                        <td className="actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(task);
                            }}
                            title="Edit"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task._id);
                            }}
                            title="Delete"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right Side - Task Report (30%) */}
          <div className="task-report-panel">
            {selectedTask ? (
              <div className="task-report">
                <div className="report-header">
                  <h2>Task Report</h2>
                </div>

                <div className="report-content">
                  <div className="report-section">
                    <h3 className="report-title">{selectedTask.title}</h3>
                    <p className="report-description">
                      {selectedTask.description || 'No description provided'}
                    </p>
                  </div>

                  <div className="report-badges">
                    <div className="badge-group">
                      <label>Status</label>
                      <span className={`badge ${getStatusBadgeClass(selectedTask.status)}`}>
                        {selectedTask.status === 'in-progress'
                          ? 'In Progress'
                          : selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="report-field">
                    <label>Created Date</label>
                    <p>
                      {new Date(selectedTask.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </div>

                  <div className="report-actions">
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        handleUpdateTask(selectedTask._id, {
                          status:
                            selectedTask.status === 'completed'
                              ? 'pending'
                              : selectedTask.status === 'pending'
                              ? 'in-progress'
                              : 'completed',
                        })
                      }
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-task-selected">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 12h6m-6 4h6M9 8h6m3 5a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>Select a task to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="modal-overlay" onClick={() => setShowAddTaskModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddTaskModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddTask} className="modal-form">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  value={newTaskData.title}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, title: e.target.value })
                  }
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTaskData.description}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, description: e.target.value })
                  }
                  placeholder="Enter task description"
                  rows="4"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newTaskData.status}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddTaskModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-form">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  value={newTaskData.title}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, title: e.target.value })
                  }
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTaskData.description}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, description: e.target.value })
                  }
                  placeholder="Enter task description"
                  rows="4"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newTaskData.status}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}{/* Mobile Bottom Navigation */}
<nav className="mobile-bottom-nav">
  <a href="#dashboard" className="mobile-nav-item active">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
    <span>Dashboard</span>
  </a>

  <button className="mobile-nav-item" onClick={() => setShowAddTaskModal(true)}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 8v8M8 12h8"></path>
    </svg>
    <span>Add Task</span>
  </button>

  <button
    className="mobile-nav-item"
    onClick={() => {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
      localStorage.setItem('darkMode', newDarkMode.toString());
    }}
  >
    {darkMode ? (
      <>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <span>Light</span>
      </>
    ) : (
      <>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span>Dark</span>
      </>
    )}
  </button>

  <button className="mobile-nav-item" onClick={handleLogout}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
    </svg>
    <span>Logout</span>
  </button>
</nav>

    </div>
  );
};

export default Dashboard;
