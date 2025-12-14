import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyEmailPending.css';

function VerifyEmailPending() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, phone } = location.state || {};

  console.log('VerifyEmailPending props:', { email, phone });

  // If no data, show error message
  if (!email || !phone) {
    return (
      <div className="verify-pending-container">
        <div className="verify-pending-box">
          <div className="error-icon">❌</div>
          <h1>Session Expired</h1>
          <p>Please go back and register again.</p>
          <button className="back-button" onClick={() => navigate('/register')}>
            Back to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-pending-container">
      <div className="verify-pending-box">
        <div className="email-icon">📧</div>
        <h1>Check Your Email</h1>
        <p>We've sent a verification link to:</p>
        <p className="email-address">{email}</p>
        
        <div className="instructions">
          <h3>What to do next:</h3>
          <ol>
            <li>Check your inbox (and spam folder)</li>
            <li>Click the verification link in the email</li>
            <li>You'll be automatically logged in</li>
          </ol>
        </div>

        <div className="fallback-info">
          <p><strong></strong></p>
          <p><strong>Your Phone:</strong> {phone}</p>
        </div>

        <div className="action-buttons">
          <button className="back-button" onClick={() => navigate('/register')}>
            Use Different Email
          </button>
          <button className="back-button" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPending;