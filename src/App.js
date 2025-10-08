import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { tasksAPI } from './services/api';
import { getCurrentUser, removeAuthToken, removeCurrentUser, isAuthenticated } from './utils/auth';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setCurrentView('tasks');
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('tasks');
    fetchTasks();
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentView('tasks');
    fetchTasks();
  };

  const handleLogout = () => {
    removeAuthToken();
    removeCurrentUser();
    setUser(null);
    setTasks([]);
    setCurrentView('login');
  };

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await tasksAPI.updateTask(editingTask.id, taskData);
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  return (
    <div className="container-fluid">
      {user && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
          <div className="container">
            <span className="navbar-brand">Task Manager</span>
            <div className="navbar-nav ms-auto">
              <span className="navbar-text me-3">
                Welcome, {user.username}
              </span>
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}

      <div className="container">
        {!user && currentView === 'login' && (
          <Login 
            onSwitchToRegister={() => setCurrentView('register')}
            onLogin={handleLogin}
          />
        )}

        {!user && currentView === 'register' && (
          <Register 
            onSwitchToLogin={() => setCurrentView('login')}
            onRegister={handleRegister}
          />
        )}

        {user && currentView === 'tasks' && (
          <>
            <div className="row mb-4">
              <div className="col">
                <div className="d-flex justify-content-between align-items-center">
                  <h2>My Tasks</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setEditingTask({})}
                    disabled={!!editingTask}
                  >
                    + New Task
                  </button>
                </div>
              </div>
            </div>

            {editingTask && (
              <div className="row mb-4">
                <div className="col-md-8 col-lg-6">
                  <TaskForm
                    onSubmit={editingTask.id ? handleUpdateTask : handleCreateTask}
                    initialData={editingTask}
                    onCancel={cancelEditing}
                  />
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onEdit={startEditing}
                onDelete={handleDeleteTask}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;