// src/components/DonationSection.jsx
import React, { useState } from 'react';
import './DonationSection.css';

function DonationSection() {
  const [copied, setCopied] = useState(false);
  
  const handleCopyUPI = () => {
    navigator.clipboard.writeText('paytmqr5ux51q@ptys');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="donation-container">
      <h3>❤️ Support This Project</h3>
      <p className="donation-subtitle">Help keep Secret Crush free and running for everyone!</p>
      
      <div className="donation-options">
        {/* Buy Me a Coffee Button */}
        <div className="donation-option">
          <div className="donation-header">
            <span className="donation-emoji">☕</span>
            <h4>Buy Me a Coffee</h4>
          </div>
          <p>Support with a small donation</p>
          <a 
            href="https://buymeacoffee.com/secretcrushapp" 
            target="_blank" 
            rel="noopener noreferrer"
            className="donation-button bmc-button"
          >
            Support on Buy Me a Coffee
          </a>
        </div>

        {/* UPI Donation Option */}
        <div className="donation-option">
          <div className="donation-header">
            <span className="donation-emoji">📱</span>
            <h4>UPI Payment (India)</h4>
          </div>
          <p>Scan or copy UPI ID</p>
          <div className="upi-section">
            <div className="upi-id-display">
              <code>paytmqr5ux51q@ptys</code>
              <button 
                onClick={handleCopyUPI}
                className="copy-button"
              >
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
            <p className="upi-note">Paste in any UPI app (GPay, PhonePe, Paytm)</p>
          </div>
        </div>
      </div>
      
      <p className="donation-footer">Thank you for your support! Every contribution helps. 🙏</p>
    </div>
  );
}

export default DonationSection;