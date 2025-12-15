import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (!phone || !email || !password) {
      setError('Phone number, email, and password are required');
      return;
    }
    
    if (phone.length < 10) {
      setError('Phone number must be at least 10 digits');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('📤 Sending registration request...');
      
      const response = await axios.post('https://secret-crush-app-backend.onrender.com/api/auth/register', {
        phone: phone,
        email: email,
        password: password
      }, {
        timeout: 10000 // 10 second timeout
      });
      
      console.log('✅ Registration response:', response.data);
      
      if (response.data.success) {
        // Save the session token
        localStorage.setItem('sessionToken', response.data.sessionToken);
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userPhone', response.data.user.phone);
        localStorage.setItem('userId', response.data.user.id);
        
        console.log('✅ User data saved to localStorage');
        
        // Show success alert
        alert('✅ Registration successful! You are now logged in.');
        
        // Redirect to dashboard after alert
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 100);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error details:', error);
      
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Please check your internet connection and try again.');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. The server is taking too long to respond.');
      } else if (error.response) {
        // Server responded with error status
        if (error.response.status === 404) {
          setError('Registration endpoint not found. The server may be misconfigured.');
        } else if (error.response.status === 400) {
          setError(error.response.data.message || 'Invalid registration data');
        } else if (error.response.status === 409) {
          setError('User with this email or phone already exists');
        } else {
          setError(error.response.data?.message || `Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        setError('No response from server. Please check if the backend is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Optional: Add floating hearts animation
  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < 15; i++) {
      hearts.push(
        <div
          key={i}
          className="heart"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            fontSize: `${Math.random() * 15 + 10}px`
          }}
        >
          💖
        </div>
      );
    }
    return hearts;
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {/* Floating Hearts Background */}
        <div className="hearts-container">
          {renderHearts()}
        </div>
        
        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner" style={{ width: '50px', height: '50px' }}></div>
            <div className="loading-text">Creating your account...</div>
          </div>
        )}
        
        <h1>Create Your Account</h1>
        
        {/* Success Message */}
        <div className="success-note">
          <p>
            <strong></strong> Don't misuse it! Donate us to improve this application!
          </p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="error-message">
            <p>
              <strong>❌ Error:</strong> {error}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              placeholder="Enter your phone number (10+ digits)"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Password *</label>
            <input
              type="password"
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
              minLength="6"
              disabled={loading}
            />
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="password-strength">
                <div 
                  className="strength-bar" 
                  style={{ 
                    width: `${passwordStrength}%`,
                    backgroundColor: passwordStrength >= 75 ? '#4caf50' : 
                                   passwordStrength >= 50 ? '#ff9800' : 
                                   '#f44336'
                  }}
                ></div>
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span> Creating Account...
              </>
            ) : (
              'Create Account & Login'
            )}
          </button>
        </form>
        
        <div className="info-section">
          <div className="info-item">
            <span className="icon">✅</span>
            <span><strong>Instant Access:</strong> No email verification needed</span>
          </div>
          <div className="info-item">
            <span className="icon">📱</span>
            <span>Phone number is required for crush requests</span>
          </div>
          <div className="info-item">
            <span className="icon">🔐</span>
            <span>You'll be automatically logged in after registration</span>
          </div>
        </div>
        
        <div className="login-link">
          <p>Already have an account? <span onClick={() => navigate('/login')}>Login here</span></p>
        </div>
        
        <button 
          className="back-button" 
          onClick={() => navigate('/')}
          disabled={loading}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Register;