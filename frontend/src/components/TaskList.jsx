import React from 'react';

const TaskList = ({ tasks = [], onDelete, onUpdate, isLoading = false }) => {
  const [editingId, setEditingId] = React.useState(null);
  const [editData, setEditData] = React.useState({});

  const handleEditClick = (task) => {
    setEditingId(task._id);
    setEditData({
      title: task.title,
      description: task.description,
      status: task.status
    });
  };

  const handleSave = (taskId) => {
    onUpdate(taskId, editData);
    setEditingId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'in-progress':
        return '#ffc107';
      case 'pending':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  if (tasks.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>No tasks yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Your Tasks</h3>
      {tasks.map((task) => (
        <div key={task._id} style={styles.taskCard}>
          {editingId === task._id ? (
            // Edit Mode
            <div style={styles.editForm}>
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                style={styles.input}
              />
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                style={{ ...styles.input, minHeight: '80px' }}
                rows="3"
              />
              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
                style={styles.input}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div style={styles.editActions}>
                <button
                  onClick={() => handleSave(task._id)}
                  style={{ ...styles.actionButton, backgroundColor: '#28a745' }}
                  disabled={isLoading}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{ ...styles.actionButton, backgroundColor: '#6c757d' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              <div style={styles.taskHeader}>
                <div>
                  <h4 style={styles.taskTitle}>{task.title}</h4>
                  <p style={styles.taskDescription}>{task.description}</p>
                </div>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(task.status)
                  }}
                >
                  {task.status}
                </span>
              </div>
              <div style={styles.taskActions}>
                <button
                  onClick={() => handleEditClick(task)}
                  style={{ ...styles.actionButton, backgroundColor: '#007bff' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task._id)}
                  style={{ ...styles.actionButton, backgroundColor: '#dc3545' }}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '30px'
  },
  title: {
    color: '#333',
    marginBottom: '20px'
  },
  taskCard: {
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  taskTitle: {
    margin: '0 0 8px 0',
    color: '#333'
  },
  taskDescription: {
    margin: '0',
    color: '#666',
    fontSize: '14px'
  },
  statusBadge: {
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    marginLeft: '10px'
  },
  taskActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  },
  actionButton: {
    padding: '6px 12px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px dashed #ddd'
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  editActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  }
};

export default TaskList;
