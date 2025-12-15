import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserDashboard.css';
import DonationSection from '../components/DonationSection';

function UserDashboard() {
  const [userStats, setUserStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('sessionToken');
    if (!token) {
      alert('Please login to access your dashboard');
      navigate('/login');
      return;
    }
    
    fetchUserData();
  }, [navigate, retryCount]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const sessionToken = localStorage.getItem('sessionToken');
      const userEmail = localStorage.getItem('userEmail');
      const userPhone = localStorage.getItem('userPhone');
      
      console.log('📱 Fetching dashboard data for:', userEmail);
      console.log('🔑 Using token:', sessionToken ? 'Present' : 'Missing');
      
      if (!sessionToken) {
        setError('No session found. Please login again.');
        setLoading(false);
        return;
      }
      
      // Try different approaches
      let response;
      
      try {
        // Method 1: With Bearer token (preferred)
        response = await axios.get('https://secret-crush-app-backend.onrender.com/api/users/my-requests', {
          headers: { 
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
      } catch (bearerError) {
        console.log('Bearer token failed, trying alternative...');
        
        // Method 2: With simple token header
        response = await axios.get('https://secret-crush-app-backend.onrender.com/api/users/my-requests', {
          headers: { 
            'Authorization': sessionToken,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
      }
      
      console.log('✅ Dashboard API Response:', response.data);
      
      if (response.data.success) {
        setUserStats(response.data.userStats);
        setRequests(response.data.requests || []);
      } else {
        setError(response.data.message || 'Failed to load dashboard data');
      }
      
    } catch (error) {
      console.error('❌ Dashboard fetch error details:', error);
      
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Check your internet connection.');
      } else if (error.response) {
        // Handle specific HTTP errors
        if (error.response.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.clear();
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response.status === 404) {
          setError('Dashboard endpoint not found. Contact support.');
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Server is taking too long to respond.');
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = () => {
    navigate('/crush-request');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userId');
      navigate('/');
    }
  };

  const refreshDashboard = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleCopyLink = async (secretLink, e) => {
    e.preventDefault();
    const copyButton = e.currentTarget;
    const originalText = copyButton.innerHTML;
    
    try {
      // Create a temporary textarea for copying
      const textArea = document.createElement('textarea');
      textArea.value = secretLink;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Try to copy
      let successful = false;
      try {
        successful = document.execCommand('copy');
      } catch (err) {
        // Fallback for modern browsers
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(secretLink);
          successful = true;
        }
      }
      
      document.body.removeChild(textArea);
      
      if (successful) {
        // Visual feedback
        copyButton.innerHTML = '✅ Copied!';
        copyButton.classList.add('copied');
        
        setTimeout(() => {
          copyButton.innerHTML = originalText;
          copyButton.classList.remove('copied');
        }, 2000);
        
        // Show success message
        alert('✅ Link copied to clipboard!\n\n (optional) Share this link with your crush via WhatsApp, SMS, or any messaging app if you want to because we will share ourselves!');
      } else {
        throw new Error('Copy failed');
      }
      
    } catch (err) {
      console.error('Copy failed:', err);
      
      // Fallback: Let user select and copy manually
      alert(
        '📱 Mobile Copy Tip:\n\n1. Long press on the link below\n2. Select "Copy" from the menu\n3. Or tap and hold to select all text\n\nThen share it with your crush! 💕'
      );
      
      // Focus the input for manual copy
      const input = e.target.closest('.secret-link-section').querySelector('.secret-link-input');
      if (input) {
        input.focus();
        input.select();
      }
    }
  };

  const handleLinkClick = (secretLink, e) => {
    e.currentTarget.select();
  };

  if (loading && retryCount === 0) {
    return (
      <div className="dashboard-container">
        <div className="loading-screen">
          <div className="spinner-large"></div>
          <h2>Loading your dashboard...</h2>
          <p>Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Your Secret Crush Dashboard 💌</h1>
          <p className="welcome-message">
            Welcome back, {localStorage.getItem('userEmail')?.split('@')[0] || 'User'}!
          </p>
        </div>
        <div className="header-right">
          <button className="refresh-btn" onClick={refreshDashboard} disabled={loading}>
            {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="dashboard-error" style={{
          background: '#ffebee',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '25px',
          borderLeft: '5px solid #f44336'
        }}>
          <h3 style={{ color: '#c62828', marginTop: 0 }}>❌ Error Loading Dashboard</h3>
          <p style={{ color: '#c62828' }}>{error}</p>
          <div className="error-actions">
            <button onClick={refreshDashboard} className="retry-btn">
              🔄 Retry
            </button>
            <button onClick={() => navigate('/login')} className="login-btn">
              🔐 Login Again
            </button>
            <button onClick={() => navigate('/')} className="home-btn">
              🏠 Back to Home
            </button>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {userStats && !error && (
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <h3>Total Requests</h3>
            <p className="stat-number">{userStats.requestCount}</p>
            <p className="stat-subtitle">Requests Sent</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <h3>Email Status</h3>
            <p className={`stat-status ${userStats.isEmailVerified ? 'verified' : 'pending'}`}>
              {userStats.isEmailVerified ? '✅ Verified' : '❌ Not Verified'}
            </p>
            <p className="stat-subtitle">Account Status</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <h3>Next Request</h3>
            <p className={`stat-info ${userStats.canSendRequest ? 'available' : 'unavailable'}`}>
              {userStats.canSendRequest ? '✅ Available Now' : `⏳ ${userStats.nextRequestDate || 'Not Available'}`}
            </p>
            <p className="stat-subtitle">Request Status</p>
          </div>
        </div>
      )}

      {/* Create Request Button */}
      <div className="action-section">
        <button 
          className="create-request-btn"
          onClick={handleCreateRequest}
          disabled={(userStats && !userStats.canSendRequest) || loading}
        >
          <span className="btn-icon">💘</span>
          <span className="btn-text">Create New Crush Request</span>
        </button>
        
        {userStats && !userStats.canSendRequest && (
          <div className="request-limitation">
            <p className="limit-message">
              ⚠️ You've reached your request limit. Next request available on:
            </p>
            <p className="limit-date">{userStats.nextRequestDate}</p>
          </div>
        )}
        
        <p className="action-help">
          Send anonymous crush requests to your friends and see if they like you back!
        </p>
      </div>

      {/* Beginner Friendly Guide */}
      <div className="beginner-tip">
        <h4>🎯 How It Works:</h4>
        <ul>
          <li><strong>Step 1:</strong> Click "Create New Crush Request" above</li>
          <li><strong>Step 2:</strong> Enter your crush's details and a message</li>
          <li><strong>Step 3:</strong> Copy the secret link and share it with them</li>
          <li><strong>Step 4:</strong> They click the link and enter who THEY like</li>
          <li><strong>Step 5:</strong> If they enter YOUR name... IT'S A MATCH! 🎉</li>
        </ul>
        <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#667eea' }}>
          💝 Your identity remains secret unless it's a mutual match!
        </p>
      </div>

      {/* Existing Requests */}
      <div className="requests-section">
        <div className="section-header">
          <h2>Your Crush Requests ({requests.length})</h2>
          <button onClick={refreshDashboard} className="refresh-small-btn">
            {loading ? '🔄' : '🔄'}
          </button>
        </div>
        
        {loading ? (
          <div className="loading-requests">
            <div className="spinner-small"></div>
            <p>Loading your requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="no-requests">
            <div className="empty-state-icon">💌</div>
            <h3>No Crush Requests Yet</h3>
            <p>You haven't sent any crush requests yet.</p>
            <p className="empty-state-cta">Click the button above to send your first secret crush! 💕</p>
            <button onClick={handleCreateRequest} className="empty-state-btn">
              Send Your First Crush Request
            </button>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((request, index) => (
              <div key={request.requestId || index} className="request-card">
                <div className="request-header">
                  <div className="request-title">
                    <h3>To: {request.crushName || 'Unknown'}</h3>
                    <p className="request-phone">{request.crushPhone || 'No phone'}</p>
                  </div>
                  <span className={`status-badge status-${request.status || 'pending'}`}>
                    {request.status || 'pending'}
                  </span>
                </div>
                
                <div className="request-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Sent:</span>
                    <span className="detail-value">{request.createdAt || 'Unknown date'}</span>
                  </div>
                  
                  {request.message && (
                    <div className="detail-row">
                      <span className="detail-label">💬 Message:</span>
                      <span className="detail-value">"{request.message}"</span>
                    </div>
                  )}
                  
                  {request.isMatch && (
                    <div className="match-banner">
                      🎉 IT'S A MATCH! 🎉
                    </div>
                  )}
                  
                  {request.crushResponse && (
                    <div className="response-section">
                      <span className="detail-label">🤔 Their Response:</span>
                      <span className="detail-value">{request.crushResponse}</span>
                    </div>
                  )}
                </div>
                
                {request.secretLink && (
                  <div className="secret-link-section">
                    <div className="link-header">
                      <span className="detail-label">🔗 Secret Link:</span>
                      <button 
                        onClick={(e) => handleCopyLink(request.secretLink, e)}
                        className="copy-link-btn"
                      >
                        📋 Copy Link
                      </button>
                    </div>
                    <div className="link-display">
                      <textarea 
                        value={request.secretLink} 
                        readOnly 
                        className="secret-link-input"
                        rows="2"
                        onClick={handleLinkClick}
                      />
                    </div>
                    <div className="url-display-helper">
                      💡 Tip: optional:Tap on the link above to select it, then share with your crush if you want to because We will handle it!
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Donation Section */}
      <DonationSection />
      
      {/* Footer */}
      <div className="dashboard-footer">
        <p className="footer-text">
          💝 Need help? Contact support at: secretcrushappofficial@gmail.com
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Secret Crush App. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default UserDashboard;