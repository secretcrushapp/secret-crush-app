import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CrushResponse.css';
import DonationSection from '../components/DonationSection';

function CrushResponse() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [theirCrushName, setTheirCrushName] = useState('');
  const [requestInfo, setRequestInfo] = useState(null);
  const [result, setResult] = useState(null);
  
  const { requestId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestInfo();
  }, [requestId]);

  const fetchRequestInfo = async () => {
    try {
      console.log('🔄 Fetching request info for:', requestId);
      const response = await axios.get(`https://secret-crush-app-backend.onrender.com/api/crush-requests/response/${requestId}`);
      
      console.log('✅ Backend response:', response.data);

      if (response.data.success) {
        if (response.data.alreadyResponded) {
          // User already responded - show the result
          console.log('ℹ️ User already responded, showing result');
          setResult(response.data);
        } else {
          // User can respond
          setRequestInfo(response.data);
        }
      } else {
        setResult({ 
          success: false, 
          message: response.data.message || 'Invalid or expired link' 
        });
      }
    } catch (error) {
      console.error('❌ Error fetching request:', error);
      setResult({ 
        success: false, 
        message: error.response?.data?.message || 'Failed to load request' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!theirCrushName.trim()) {
      alert('Please enter the name of your crush');
      return;
    }
    
    setSubmitting(true);

    try {
      console.log('🎯 Submitting crush response:', theirCrushName);
      
      const response = await axios.post(`https://secret-crush-app-backend.onrender.com/api/crush-requests/response/${requestId}`, {
        theirCrushName: theirCrushName.trim()
      });

      console.log('✅ Submission response:', response.data);
      setResult(response.data);

    } catch (error) {
      console.error('❌ Error submitting response:', error);
      console.log('Error details:', error.response?.data);
      
      setResult({ 
        success: false, 
        message: error.response?.data?.message || 'Submission failed. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="crush-response-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your secret crush request...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="crush-response-container">
        <div className={`result-box ${result.isMatch ? 'success' : 'no-match'}`}>
          {result.alreadyResponded && (
            <div className="already-responded-notice">
              <p>📝 <strong>You already responded to this request</strong></p>
            </div>
          )}
          
          {result.isMatch ? (
            <>
              <h1>🎉 {result.alreadyResponded ? 'IT WAS A MATCH!' : 'IT\'S A MATCH!'}</h1>
              <div className="match-celebration">
                <p>{result.message}</p>
                
                {result.matchDetails && (
                  <div className="match-details">
                    <h3>🎊 Congratulations! You both like each other!</h3>
                    <div className="detail-item">
                      <strong>Your Admirer:</strong> {result.matchDetails.yourAdmirer}
                    </div>
                    <div className="detail-item">
                      <strong>Contact:</strong> {result.matchDetails.admirerPhone}
                    </div>
                    <div className="detail-item">
                      <strong>You Like:</strong> {result.matchDetails.yourCrush}
                    </div>
                    {result.matchDetails.message && (
                      <div className="detail-item message">
                        <strong>Their Message:</strong> 
                        <div className="message-text">"{result.matchDetails.message}"</div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="celebration-text">
                  🎉 Time to connect and chat! 🎉
                </div>
              </div>
            </>
          ) : (
            <>
              <h1>💔 No Mutual Crush</h1>
              <p>{result.message}</p>
              
              <div className="encouragement">
                <p>Don't worry! Crushes can be complicated. Maybe they'll like you back someday! 💫</p>
                <p>Keep your chin up! The right person will appreciate you for who you are. ✨</p>
              </div>
            </>
          )}
          
          <button 
            className="home-btn" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
        

      </div>
    );
  }

  return (
    <div className="crush-response-container">
      <div className="crush-response-box">
        <h1>💖 Secret Admirer Alert!</h1>
        <p className="excitement-text">Someone has a crush on you! Tell us who YOU like to see if it's mutual.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter your crush name *</label>
            <input
              type="text"
              placeholder="Enter your crush name"
              value={theirCrushName}
              onChange={(e) => setTheirCrushName(e.target.value)}
              required
            />
            <small style={{ color: 'red' }} >Note:Enter who YOU like to see if it's the same person who likes you.We don't reveal your crush name to anyone,So,Enter your crush name without any fear!</small>
          </div>

          <button 
            type="submit" 
            disabled={submitting || !theirCrushName.trim()} 
            className="submit-btn"
          >
            {submitting ? (
              <>
                <div className="button-spinner"></div>
                Checking for Matches...
              </>
            ) : (
              'Check for Mutual Crush! 💕'
            )}
          </button>

          {/* YouTube Video Section - Added below submit button */}
          <div className="confusion-helper">
            <div className="confusion-header">
              <span className="confusion-icon">🤔</span>
              <h4>Confused? Watch This Quick Video</h4>
            </div>
            <p className="confusion-subtitle">
              Not sure how this works? This 40-second video explains everything!
            </p>
            
            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/5VuX2dLaQ8E"
                title="How Secret Crush Works - Quick Explanation"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="helper-video"
              ></iframe>
            </div>
            
            <div className="video-key-points">
              <div className="point">
                <span>🔒</span>
                <p>Your name stays secret unless it's mutual</p>
              </div>
              <div className="point">
                <span>💝</span>
                <p>Only enter who YOU actually like</p>
              </div>
              <div className="point">
                <span>✨</span>
                <p>Completely safe and anonymous</p>
              </div>
            </div>
            
            <p className="confusion-cta">
              <strong>Watch → Understand → Then submit your answer!</strong>
            </p>
          </div>
          {/* End of YouTube Video Section */}
        </form>

        <div className="security-note">
          <p>🔒 Your information is completely safe. We only reveal matches if both people like each other.</p>
          <p>💡 Tip: Enter the name of the person you think might have sent you this secret message!</p>
        </div>
      </div>
    </div>
  );
}

export default CrushResponse;