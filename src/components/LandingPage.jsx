import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import DonationSection from '../components/DonationSection';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* HEADER with immediate CTA */}
        <header className="landing-header">
          <h1>Secret Crush 💌</h1>
          <p className="tagline">Find out if your crush likes you back... Anonymously!</p>
          
          {/* IMMEDIATE ACTION BUTTONS */}
          <div className="primary-cta">
            <p className="cta-subtitle">Start your journey in 30 seconds:</p>
            <div className="cta-buttons">
              <button 
                className="cta-btn register-btn"
                onClick={() => navigate('/register')}
              >
                <span className="btn-icon">✨</span>
                <span className="btn-text">Create Free Account</span>
                <span className="btn-arrow">→</span>
              </button>
              
              <div className="login-option">
                <span className="login-text">Already have an account?</span>
                <button 
                  className="login-btn"
                  onClick={() => navigate('/login')}
                >
                  Login Here
                </button>
              </div>
            </div>
            
            <div className="trust-badges">
              <div className="badge">
                <span>✅</span> 100% Free
              </div>
              <div className="badge">
                <span>✅</span> No Credit Card
              </div>
              <div className="badge">
                <span>✅</span> Easy 2-Min Setup
              </div>
            </div>
          </div>
        </header>

        {/* QUICK HOW-IT-WORKS (Visual) */}
        <section className="quick-guide">
          <h2>How It Works in 4 Simple Steps 🚀</h2>
          
          <div className="steps-visual">
            <div className="step">
              <div className="step-visual">1</div>
              <div className="step-content">
                <h3>Sign Up Free</h3>
                <p>Just your email & phone (for privacy)</p>
              </div>
            </div>
            
            <div className="connector">→</div>
            
            <div className="step">
              <div className="step-visual">2</div>
              <div className="step-content">
                <h3>Create Request</h3>
                <p>Enter your crush's name & phone</p>
              </div>
            </div>
            
            <div className="connector">→</div>
            
            <div className="step">
              <div className="step-visual">3</div>
              <div className="step-content">
                <h3>Share Link</h3>
                <p>Send the secret link to your crush</p>
              </div>
            </div>
            
            <div className="connector">→</div>
            
            <div className="step">
              <div className="step-visual">4</div>
              <div className="step-content">
                <h3>Get Result</h3>
                <p>Find out if they like you back!</p>
              </div>
            </div>
          </div>
          
          <div className="visual-demo">
            <div className="demo-card demo-left">
              <div className="demo-header">You</div>
              <div className="demo-content">
                <p>"I like [Crush's Name]"</p>
                <small>Your identity: 🔒 Hidden</small>
              </div>
            </div>
            
            <div className="demo-arrow">↔️</div>
            
            <div className="demo-card demo-right">
              <div className="demo-header">Your Crush</div>
              <div className="demo-content">
                <p>"I like [Your Name]"</p>
                <small>Only shown if it's a match!</small>
              </div>
            </div>
          </div>
        </section>

        {/* KEY BENEFITS */}
        <section className="benefits">
          <h2>Why You'll Love It ✨</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🤫</div>
              <h3>100% Anonymous</h3>
              <p>Your identity stays secret unless they like you back too!</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">📱</div>
              <h3>Works on WhatsApp</h3>
              <p>Share links easily via WhatsApp, SMS, or any app</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Super Fast</h3>
              <p>Set up in 2 minutes, get results in hours</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">❤️</div>
              <h3>No Awkwardness</h3>
              <p>Protects feelings while revealing true connections</p>
            </div>
          </div>
        </section>

        {/* SUCCESS STORIES */}
        <section className="success-stories">
          <h2>Real People, Real Matches 💘</h2>
          
          <div className="stories-container">
            <div className="story">
              <div className="story-content">
                "After 6 months of wondering, I used Secret Crush. Turns out my college friend liked me too! Best decision ever!"
              </div>
              <div className="story-author">
                <strong>— Rahul, 22</strong> (Engineering Student)
              </div>
            </div>
            
            <div className="story">
              <div className="story-content">
                "The anonymous feature gave me confidence. When we matched, it was magical! We've been dating for 3 months now."
              </div>
              <div className="story-author">
                <strong>— Priya, 24</strong> (Software Developer)
              </div>
            </div>
          </div>
        </section>

        {/* SECONDARY CTA */}
        <section className="secondary-cta">
          <h2>Ready to Discover Your Match?</h2>
          <p>Join <strong>10,000+</strong> people who found their mutual crush!</p>
          
          <div className="final-cta">
            <button 
              className="final-cta-btn"
              onClick={() => navigate('/register')}
            >
              <span className="final-icon">💘</span>
              <span>Start Free Now — No Credit Card Needed</span>
            </button>
            
            <p className="small-note">
              Takes 2 minutes • 100% privacy guaranteed • No spam ever
            </p>
          </div>
        </section>

        {/* DONATION SECTION */}
        <DonationSection />

        {/* SIMPLE FAQ */}
        <section className="simple-faq">
          <h2>Common Questions 🤔</h2>
          
          <div className="faq-item">
            <h4>Is this really free?</h4>
            <p>Yes! Completely free. No hidden charges, ever.</p>
          </div>
          
          <div className="faq-item">
            <h4>What if I send to wrong person?</h4>
            <p>They won't know it's from you. Just shows "someone likes you".</p>
          </div>
          
          <div className="faq-item">
            <h4>Can I try multiple people?</h4>
            <p>One request every 3 months to keep it special and genuine.</p>
          </div>
          
          <div className="faq-item">
            <h4>Is my data safe?</h4>
            <p>Absolutely! We don't share your info with anyone.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;