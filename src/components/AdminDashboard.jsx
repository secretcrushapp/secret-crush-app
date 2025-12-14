import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    
    fetchRequests();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      console.log('🔄 Fetching requests from backend...');
      const response = await axios.get('https://secret-crush-app-backend.onrender.com/api/admin/requests');
      console.log('✅ Backend response:', response.data);
      
      if (response.data.success) {
        setRequests(response.data.requests || []);
        setStats(response.data.stats || {
          total: 0,
          pending: 0,
          contacted: 0,
          matched: 0
        });
      } else {
        console.log('❌ Backend returned success: false');
        setRequests([]);
        setStats({
          total: 0,
          pending: 0,
          contacted: 0,
          matched: 0
        });
      }
    } catch (error) {
      console.error('❌ Failed to fetch requests:', error);
      setRequests([]);
      setStats({
        total: 0,
        pending: 0,
        contacted: 0,
        matched: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId, newStatus) => {
    setUpdating(prev => ({ ...prev, [requestId]: true }));
    
    try {
      console.log('🔄 Updating status:', { requestId, newStatus });
      
      const response = await axios.put(`https://secret-crush-app-backend.onrender.com/api/admin/requests/${requestId}`, {
        status: newStatus
      });
      
      console.log('✅ Update response:', response.data);
      
      if (response.data.success) {
        // Update local state immediately for better UX
        setRequests(prev => prev.map(req => 
          req.requestId === requestId 
            ? { ...req, status: newStatus }
            : req
        ));
        
        // Also refresh stats
        fetchRequests();
      } else {
        alert('Failed to update status: ' + response.data.message);
      }
    } catch (error) {
      console.error('❌ Update error:', error);
      alert('Failed to update status. Check console for details.');
    } finally {
      setUpdating(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const openWhatsApp = (phone, message) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  const handleContactCrush = (request) => {
    const message = `Hi ${request.crushName}! 💖\n\nSomeone has a secret crush on you! 😊\n\nClick this link to find out who:\n${request.secretLink}\n\nThis link is unique to you!`;
    
    // Copy message to clipboard
    copyToClipboard(message);
    
    // Open WhatsApp
    openWhatsApp(request.crushPhone, message);
    
    // Mark as contacted
    updateStatus(request.requestId, 'contacted');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: '⏳ Pending', class: 'pending' },
      contacted: { text: '📞 Contacted', class: 'contacted' },
      matched: { text: '🎉 Matched', class: 'matched' },
      rejected: { text: '💔 Rejected', class: 'rejected' }
    };
    return statusConfig[status] || { text: status, class: 'unknown' };
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>📊 Admin Dashboard</h1>
        <button onClick={() => { localStorage.removeItem('adminAuth'); navigate('/'); }}>
          Logout
        </button>
      </header>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card total">
          <h3>Total Requests</h3>
          <p>{stats.total || 0}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p>{stats.pending || 0}</p>
        </div>
        <div className="stat-card contacted">
          <h3>Contacted</h3>
          <p>{stats.contacted || 0}</p>
        </div>
        <div className="stat-card matched">
          <h3>Matched</h3>
          <p>{stats.matched || 0}</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="requests-section">
        <h2>📋 All Crush Requests ({requests.length})</h2>
        
        {requests.length === 0 ? (
          <div className="no-requests">
            <p>No crush requests yet</p>
          </div>
        ) : (
          <div className="requests-table">
            {requests.map(request => {
              const statusBadge = getStatusBadge(request.status);
              return (
                <div key={request.requestId} className={`request-card ${request.status}`}>
                  <div className="request-info">
                    <div className="user-info">
                      <strong>From:</strong> {request.userName || 'Unknown'} ({request.userPhone})
                    </div>
                    <div className="crush-info">
                      <strong>Crush:</strong> {request.crushName} ({request.crushPhone})
                    </div>
                    {request.message && (
                      <div className="message">
                        <strong>Message:</strong> "{request.message}"
                      </div>
                    )}
                    <div className="link-info">
                      <strong>Secret Link:</strong> 
                      <span 
                        className="link" 
                        onClick={() => copyToClipboard(request.secretLink)}
                        title="Click to copy"
                      >
                        {request.secretLink}
                      </span>
                    </div>
                    <div className="meta-info">
                      <span className={`status-badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                      <span className="date">
                        {request.createdAt}
                      </span>
                      {request.matchedAt && (
                        <span className="matched-date">
                          Matched: {request.matchedAt}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="request-actions">
                    {request.status === 'pending' && (
                      <button 
                        className="whatsapp-btn"
                        onClick={() => handleContactCrush(request)}
                      >
                        📱 WhatsApp Crush
                      </button>
                    )}
                    
                    <select 
                      value={request.status} 
                      onChange={(e) => updateStatus(request.requestId, e.target.value)}
                      className="status-dropdown"
                      disabled={updating[request.requestId]}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="contacted">📞 Contacted</option>
                      <option value="matched">🎉 Matched</option>
                      <option value="rejected">💔 Rejected</option>
                    </select>
                    
                    {updating[request.requestId] && (
                      <span className="updating-text">Updating...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;