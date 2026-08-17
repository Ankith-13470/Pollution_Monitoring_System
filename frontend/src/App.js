import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import SimpleAuth from './components/SimpleAuth';
import Dashboard from './pages/Dashboard';
import Measurements from './pages/Measurements';
import Sources from './pages/Sources';
import Pollutants from './pages/Pollutants';
import Locations from './pages/Locations';
import Actions from './pages/Actions';

// Protected Route component - for ALL data tabs
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center p-5">
                <div className="display-1 text-warning">🔒</div>
                <h3 className="mt-3">Login Required</h3>
                <p className="text-muted mb-4">
                  Please login to access the pollution monitoring data and analytics.
                </p>
                <a href="/login" className="btn btn-success me-2">
                  🔐 Login
                </a>
                <a href="/signup" className="btn btn-outline-success">
                  📝 Sign Up
                </a>
                <p className="mt-3 small text-muted">
                  Or explore our <a href="/">home page</a> to learn more
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/'; // Redirect to home
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        
        <Routes>
          {/* Public Route - Only Home page */}
          <Route path="/" element={<Home />} />
          
          {/* Protected Routes - ALL data tabs require login */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/measurements" element={
            <ProtectedRoute>
              <Measurements />
            </ProtectedRoute>
          } />
          <Route path="/sources" element={
            <ProtectedRoute>
              <Sources />
            </ProtectedRoute>
          } />
          <Route path="/pollutants" element={
            <ProtectedRoute>
              <Pollutants />
            </ProtectedRoute>
          } />
          <Route path="/locations" element={
            <ProtectedRoute>
              <Locations />
            </ProtectedRoute>
          } />
          <Route path="/actions" element={
            <ProtectedRoute>
              <Actions />
            </ProtectedRoute>
          } />
          
          {/* Auth Pages */}
          <Route path="/login" element={
            user ? <Dashboard /> : <SimpleAuth onLogin={handleLogin} />
          } />
          <Route path="/signup" element={
            user ? <Dashboard /> : <SimpleAuth onLogin={handleLogin} />
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;