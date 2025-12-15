import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('https://secret-crush-app-backend.onrender.com/api/auth/login', {
        email: email,
        password: password
      });

      console.log('Login response:', response.data);
      
      if (response.data.success) {
        // ✅ Store session data
        localStorage.setItem('sessionToken', response.data.sessionToken);
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userPhone', response.data.user.phone);
        
        // ✅ Show success alert
        alert('✅ Login successful! Redirecting to dashboard...');
        
        // ✅ Redirect to dashboard
        setTimeout(() => {
          navigate('/user-dashboard'); // Changed from '/user-dashboard'
        }, 100);
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login to Secret Crush</h1>
        
        {/* ✅ ADD SUCCESS MESSAGE */}
        <div className="success-note" style={{
          background: '#e8f5e9',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          borderLeft: '4px solid #4caf50'
        }}>
          <p style={{ margin: 0, color: '#2e7d32' }}>
            <strong></strong> Donate us to keep this application free!
          </p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Password *</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
        
        <div className="login-info">
          <div className="info-item">
            <span className="icon">✅</span>
            <span><strong>Instant Access:</strong> No email verification needed</span>
          </div>
          <div className="info-item">
            <span className="icon">📱</span>
            <span>Use the same email you registered with</span>
          </div>
          <div className="info-item">
            <span className="icon">🔐</span>
            <span>Password must be at least 6 characters</span>
          </div>
        </div>
        
        <div className="login-help">
          <p>Don't have an account? <span className="link" onClick={() => navigate('/register')}>Register here</span></p>
          <p className="note">
            <span className="link" onClick={() => alert('Password reset feature coming soon! Contact support if needed.')}>
              Forgot password?
            </span>
          </p>
        </div>
        
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Login;