import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import DonationSection from '../components/DonationSection';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Secret Crush App</h1>
        <h3>Find out whether your crush likes you back</h3>
        <p>Find out if your crush likes you back... secretly!</p>
        <p>Free! Free! Free!</p>
        <div className="auth-buttons">
          <button 
            className="btn-primary"
            onClick={() => navigate('/register')}
          >
            Create New Account
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => navigate('/login')}
          >
            I Already Have an Account
          </button>
        </div>

        {/* Donation Section Added */}
        <DonationSection />

        <div className="features">
          <h2>How it works:</h2>
          <div className="feature-list">
            <div className="feature">
              <span>1️⃣</span>
              <p>Register with your phone & email</p>
            </div>
            <div className="feature">
              <span>2️⃣</span>
              <p>Send anonymous crush requests</p>
              <p>
                Your crush can't find your name until she likes you back!
              </p>
            </div>
            <div className="feature">
              <span>3️⃣</span>
              <p>Find out if it's mutual!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;