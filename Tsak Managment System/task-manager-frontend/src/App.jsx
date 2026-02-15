import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = 'http://localhost:3000/api';

  // Load token from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      setIsLoggedIn(true);
      loadTasks(savedToken);
    }
  }, []);

  // Form validation
  const validateForm = () => {
    let newErrors = {};
    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auth handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const endpoint = isSignUp ? '/register' : '/login';

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (isSignUp) {
        setSuccessMessage('Account created successfully! Please sign in.');
        setIsSignUp(false);
        setFormData({ email: '', password: '', confirmPassword: '' });
      } else {
        // Save token & user in state and localStorage
        setToken(data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccessMessage('Login successful!');
        await loadTasks(data.token);
      }

    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setTasks([]);
    setFormData({ email: '', password: '', confirmPassword: '' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSuccessMessage('Logged out successfully');
  };

  // Task handlers
  const loadTasks = async (authToken = token) => {
    if (!authToken) {
      setErrors({ tasks: 'No token available. Please login.' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (!response.ok) throw new Error('Failed to load tasks');

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setErrors({ tasks: error.message });
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setErrors({ task: 'Task title is required' });
      return;
    }

    if (!token) {
      setErrors({ task: 'No token. Please login.' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) throw new Error('Failed to create task');

      setNewTask({ title: '', description: '' });
      await loadTasks();
      setSuccessMessage('Task created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ task: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    if (!token) {
      setErrors({ task: 'No token. Please login.' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !completed })
      });

      if (!response.ok) throw new Error('Failed to update task');
      await loadTasks();
    } catch (error) {
      setErrors({ task: error.message });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!token) {
      setErrors({ task: 'No token. Please login.' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete task');
      await loadTasks();
      setSuccessMessage('Task deleted!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ task: error.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ email: '', password: '', confirmPassword: '' });
    setErrors({});
    setSuccessMessage('');
  };

  // Render Task Dashboard
  if (isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '600px' }}>
          <div className="auth-header">
            <h1>Task Manager</h1>
            <p>Welcome, {user?.email}</p>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>

          {successMessage && <div className="success-message">{successMessage}</div>}
          {errors.task && <div className="error-message">{errors.task}</div>}

          <form onSubmit={handleCreateTask} className="task-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </form>

          <div className="tasks-list">
            <h3>Your Tasks ({tasks.length})</h3>
            {tasks.length === 0 ? (
              <p className="empty-state">No tasks yet. Create your first task!</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id, task.completed)}
                    />
                    <div>
                      <h4 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.title}
                      </h4>
                      {task.description && <p>{task.description}</p>}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Auth Form
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p>{isSignUp ? 'Sign up to get started' : 'Sign in to your account'}</p>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={toggleMode} className="toggle-btn">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
