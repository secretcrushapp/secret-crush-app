// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'; // Import global CSS first

// Import your components
// In App.js - Add these routes
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import CrushRequest from './components/CrushRequest';
import CrushResponse from './components/CrushResponse';
import VerifyEmailPending from './components/VerifyEmailPending';
import VerifyEmail from './components/VerifyEmail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/crush-request" element={<CrushRequest />} />
          <Route path="/crush-response/:requestId" element={<CrushResponse />} />
          <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;