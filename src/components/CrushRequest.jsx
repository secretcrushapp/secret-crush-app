import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CrushRequest.css';

function CrushRequest() {
  const [userName, setUserName] = useState('');
  const [crushName, setCrushName] = useState('');
  const [crushPhone, setCrushPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      alert('Please login first');
      navigate('/register');
      return;
    }
    
    fetchUserStats();
  }, [navigate]);

  const fetchUserStats = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      // FIX: Use the correct endpoint
      const response = await axios.get('https://secret-crush-app-backend.onrender.com/api/users/my-requests', {
        headers: { Authorization: sessionToken }
      });
      
      if (response.data.success) {
        setUserStats(response.data.userStats);
        
        if (!response.data.userStats.canSendRequest) {
          alert(`You can only send one request every 3 months. Next request available after ${new Date(response.data.userStats.nextRequestDate).toLocaleDateString()}`);
          navigate('/user-dashboard');
        }
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('sessionToken');
        navigate('/register');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      alert('Please login first');
      navigate('/register');
      return;
    }

    setLoading(true);

    try {
      // FIX: Use the correct endpoint
      const response = await axios.post('https://secret-crush-app-backend.onrender.com/api/crush-requests/create', {
        userName,
        crushName,
        crushPhone,
        message
      }, {
        headers: { Authorization: sessionToken }
      });

      if (response.data.success) {
        alert('🎉 Crush request created successfully! You can track the status in your dashboard.');
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      if (error.response?.status === 429) {
        alert(error.response.data.message);
        navigate('/user-dashboard');
      } else if (error.response?.status === 401) {
        localStorage.removeItem('sessionToken');
        alert('Session expired. Please login again.');
        navigate('/register');
      } else {
        alert(error.response?.data?.message || 'Failed to create crush request');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking user stats
  if (!userStats) {
    return (
      <div className="crush-request-container">
        <div className="loading">Checking your request limit...</div>
      </div>
    );
  }

  // Show message if user cannot send request
  if (!userStats.canSendRequest) {
    return (
      <div className="crush-request-container">
        <div className="limit-reached">
          <h2>🚫 Request Limit Reached</h2>
          <p>You can only send one crush request every 3 months.</p>
          <p>Next request available: <strong>{new Date(userStats.nextRequestDate).toLocaleDateString()}</strong></p>
          <button onClick={() => navigate('/user-dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="crush-request-container">
      <div className="crush-request-box">
        <h1>💌 Create Crush Request</h1>
        <p>Fill in the details below. Remember: You can only send one request every 3 months.</p>
        
        <div className="request-limit-info">
          <p>📅 <strong>Request Limit:</strong> 1 request per 3 months</p>
          <p>✅ <strong>Requests Used:</strong> {userStats.requestCount || 0}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              placeholder="Enter your name as how your crush knows you"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <small>This is how your crush will identify you</small>
          </div>

          <div className="form-group">
            <label>Your Crush's Name *</label>
            <input
              type="text"
              placeholder="Enter their full name"
              value={crushName}
              onChange={(e) => setCrushName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Your Crush's Phone Number *</label>
            <input
              type="tel"
              placeholder="Enter their phone number with country code"
              value={crushPhone}
              onChange={(e) => setCrushPhone(e.target.value)}
              required
            />
            <small>We'll contact them discreetly via WhatsApp(We don't reveal your name!</small>
          </div>

          <div className="form-group">
            <label>Optional Message</label>
            <textarea
              placeholder="Want to say something special? We'll include it in the message to your crush..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
            />
            <small>This message will be shared if it's a mutual match</small>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating Request...' : 'Create Crush Request 🎯'}
          </button>
        </form>

        <div className="action-buttons">
          <button className="back-button" onClick={() => navigate('/user-dashboard')}>
            ← Back to Dashboard
          </button>
          <button className="home-button" onClick={() => navigate('/')}>
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default CrushRequest;