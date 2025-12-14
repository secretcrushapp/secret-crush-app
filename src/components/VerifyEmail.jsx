// components/VerifyEmail.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VerifyEmail.css';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    console.log('🔑 VerifyEmail component loaded');
    console.log('URL token:', token);

    if (token) {
      verifyEmail(token);
    } else {
      setShowManualInput(true);
      setStatus('manual');
      setMessage('No verification token found in URL. Please enter your token manually.');
    }
  }, [searchParams]);

  const verifyEmail = async (token) => {
    setStatus('verifying');
    setMessage('Verifying your email...');
    
    try {
      console.log('🔄 Calling verification endpoint with token:', token);
      
      const response = await axios.post('https://secret-crush-app-backend.onrender.com/api/auth/verify-email', {
        token: token
      });

      console.log('✅ Verification response:', response.data);

      if (response.data.success) {
        // Store session data
        localStorage.setItem('sessionToken', response.data.sessionToken);
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userPhone', response.data.user.phone);
        
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Verification failed');
        setShowManualInput(true);
      }
    } catch (error) {
      console.error('❌ Email verification error:', error);
      console.log('Error response:', error.response?.data);
      
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      setShowManualInput(true);
    }
  };

  const handleManualVerify = () => {
    if (!manualToken.trim()) {
      alert('Please enter your verification token');
      return;
    }
    verifyEmail(manualToken.trim());
  };

  if (status === 'verifying') {
    return (
      <div className="verify-email-container">
        <div className="verify-email-box">
          <div className="loading-spinner"></div>
          <h1>Verifying Your Email...</h1>
          <p>{message}</p>
        </div>
      </div>
    );
  }
  
  if (status === 'success') {
    return (
      <div className="verify-email-container">
        <div className="verify-email-box success">
          <div className="success-icon">✅</div>
          <h1>Email Verified Successfully!</h1>
          <p>{message}</p>
          <div className="loading-spinner-small"></div>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-email-container">
      <div className="verify-email-box">
        {status === 'error' && (
          <div className="error-icon">❌</div>
        )}
        
        <h1>{status === 'error' ? 'Verification Failed' : 'Enter Verification Token'}</h1>
        <p>{message}</p>

        {showManualInput && (
          <div className="manual-token-section">
            <div className="form-group">
              <label>Verification Token:</label>
              <input
                type="text"
                placeholder="Paste your verification token here"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                className="token-input"
              />
              <small>Check your server console for the verification token</small>
            </div>
            
            <button 
              onClick={handleManualVerify}
              className="verify-btn"
              disabled={!manualToken.trim()}
            >
              Verify Email
            </button>
          </div>
        )}

        <div className="help-section">
          <h3>Need help?</h3>
          <ul>
            <li>Check your server console for the verification token</li>
            <li>Make sure you're using the correct token from registration</li>
            <li>Tokens are long strings of random characters</li>
            <li>If stuck, try registering again to get a new token</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button 
            className="back-button"
            onClick={() => navigate('/register')}
          >
            Back to Registration
          </button>
          <button 
            className="home-button"
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;