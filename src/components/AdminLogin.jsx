import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

function AdminLogin() {
  const [username, setUsername] = useState('admin'); // Pre-filled for testing
  const [password, setPassword] = useState('admin123'); // Pre-filled for testing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('🔐 FRONTEND - Starting admin login...');
    console.log('🔐 FRONTEND - Username:', username);
    console.log('🔐 FRONTEND - Password:', password);
    
    // Prepare the request data
    const requestData = {
      username: username.trim(),
      password: password.trim()
    };
    
    console.log('🔐 FRONTEND - Request data:', JSON.stringify(requestData));
    
    try {
      console.log('🔐 FRONTEND - Sending request to: https://secret-crush-app-backend.onrender.com/api/admin/login');
      
      const response = await axios.post('https://secret-crush-app-backend.onrender.com/api/admin/login', 
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          timeout: 10000
        }
      );
      
      console.log('🔐 FRONTEND - Response received:', response.data);
      console.log('🔐 FRONTEND - Response status:', response.status);
      
      if (response.data.success) {
        console.log('✅ FRONTEND - Login successful!');
        // Store admin authentication
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminData', JSON.stringify(response.data.admin || {}));
        
        // Show success message
        alert('✅ Admin login successful! Redirecting to dashboard...');
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        console.log('❌ FRONTEND - Login failed:', response.data.message);
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('❌ FRONTEND - Request failed:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log('❌ FRONTEND - Error response data:', error.response.data);
        console.log('❌ FRONTEND - Error response status:', error.response.status);
        console.log('❌ FRONTEND - Error response headers:', error.response.headers);
        
        setError(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('❌ FRONTEND - No response received:', error.request);
        setError('No response from server. Check if backend is running.');
      } else {
        // Something happened in setting up the request
        console.log('❌ FRONTEND - Request setup error:', error.message);
        setError('Request failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      console.log('🔗 Testing connection to backend...');
      const response = await axios.get('https://secret-crush-app-backend.onrender.com/api/admin/test');
      console.log('✅ Connection test successful:', response.data);
      alert('✅ Backend is reachable!\n' + JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      alert('❌ Cannot connect to backend. Make sure server is running on port 5000.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1>🔐 Admin Login</h1>
        <p>Enter admin credentials to access the dashboard</p>
        
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <>
                <span className="spinner"></span> Logging in...
              </>
            ) : (
              'Login as Admin'
            )}
          </button>
        </form>
        
        <div className="credentials-info">
          <h3>📋 Test Credentials</h3>
          <div className="credential-row">
            <span className="label">:</span>
            <code className="value"></code>
          </div>
          <div className="credential-row">
            <span className="label">:</span>
            <code className="value"></code>
          </div>
          <p className="note"></p>
        </div>
        
        <div className="action-buttons">

          
          <button 
            type="button"
            className="back-button" 
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;