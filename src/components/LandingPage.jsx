import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import DonationSection from '../components/DonationSection';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Secret Crush 💌</h1>
          <p className="tagline">Discover if your crush likes you back... anonymously!</p>
          
          <div className="highlight-box">
            <p className="highlight-text">
              <strong>100% Anonymous • No Awkwardness • Real Results</strong>
            </p>
          </div>
        </div>

        {/* How It Works - Clear Steps */}
        <div className="how-it-works">
          <h2>How It Works 🚀</h2>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Request</h3>
                <p>Sign up, then create an anonymous crush request with your crush's phone number.</p>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Share Secret Link</h3>
                <p>We generate a unique link. Share it with your crush via WhatsApp, SMS, or any message.</p>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>They Respond Anonymously</h3>
                <p>Your crush clicks the link and enters who THEY like. They don't know it's from you!</p>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Discover The Truth</h3>
                <p>If they enter YOUR name... It's a MATCH! 🎉 Otherwise, no one's feelings get hurt.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="key-features">
          <h2>Why Choose Secret Crush? ✨</h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <h4>Complete Privacy</h4>
              <p>Your identity stays hidden unless it's mutual. No awkward moments!</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <h4>Mobile Friendly</h4>
              <p>Works perfectly on any device. Share links easily via WhatsApp.</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <h4>Real Names Only</h4>
              <p>Uses real names (not usernames) for accurate matching.</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💝</span>
              <h4>Respectful Approach</h4>
              <p>Protects everyone's feelings while revealing true connections.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <h2>Ready to Find Out? 💘</h2>
          <p className="cta-subtitle">Join thousands who discovered their mutual crishes!</p>
          
          <div className="auth-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate('/register')}
            >
              Start Free Now
            </button>
            
            <button 
              className="btn-secondary"
              onClick={() => navigate('/login')}
            >
              I Already Have an Account
            </button>
          </div>
          
          <div className="security-note">
            <p>✅ No credit card required • ✅ Free forever • ✅ 100% secure</p>
          </div>
        </div>

        {/* Success Stories */}
        <div className="success-stories">
          <h2>Real Stories, Real Matches ❤️</h2>
          <div className="stories-container">
            <div className="story-card">
              <p>"I was scared for months! Used Secret Crush and found out my best friend liked me back! Now we're dating!"</p>
              <span className="story-author">- Rahul, Mumbai</span>
            </div>
            <div className="story-card">
              <p>"The anonymous part made me feel safe. When we matched, it was the best surprise of my life!"</p>
              <span className="story-author">- Priya, Delhi</span>
            </div>
          </div>
        </div>

        {/* Donation Section */}
        <div className="donation-wrapper">
          <DonationSection />
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions 🤔</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h4>Is it really anonymous?</h4>
              <p>Yes! Your crush only sees your name if they ALSO enter your name as their crush.</p>
            </div>
            <div className="faq-item">
              <h4>What if I send to wrong person?</h4>
              <p>They'll just see a message that someone likes them. They won't know it was you.</p>
            </div>
            <div className="faq-item">
              <h4>How many requests can I send?</h4>
              <p>One request every 3 months to ensure genuine connections.</p>
            </div>
            <div className="faq-item">
              <h4>Is this safe for teens?</h4>
              <p>Yes! Our system protects everyone's feelings and identities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;