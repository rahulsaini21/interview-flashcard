// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../css/Auth.css';

const LoginPage = () => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (mode === 'register') {
        await register(username, password);
        setMessage('Registration successful! Please login.');
        setMode('login');
      } else {
        await login(username, password);
        navigate('/');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{mode === 'login' ? 'Login' : 'Register'}</h1>
        
        {message && <div className={`message ${mode === 'register' ? 'success' : ''}`}>{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        
        <div className="switch-mode">
          {mode === 'login' 
            ? "Don't have an account? " 
            : "Already have an account? "}
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="switch-button"
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;