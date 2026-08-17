import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Pollution Monitor
        </Link>
        
        {/* Hamburger menu for mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navigation Links - ALL TABS VISIBLE TO EVERYONE */}
          <div className="navbar-nav me-auto">
            <Link 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
              to="/"
            >
              🏠 Home
            </Link>
            <Link 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} 
              to="/dashboard"
            >
              📊 Dashboard
            </Link>
            <Link 
              className={`nav-link ${location.pathname === '/measurements' ? 'active' : ''}`} 
              to="/measurements"
            >
              Measurements
            </Link>
            <Link 
              className={`nav-link ${location.pathname === '/sources' ? 'active' : ''}`} 
              to="/sources"
            >
              Sources
            </Link>
            <Link 
              className={`nav-link ${location.pathname === '/pollutants' ? 'active' : ''}`} 
              to="/pollutants"
            >
              Pollutants
            </Link>
            <Link 
              className={`nav-link ${location.pathname === '/locations' ? 'active' : ''}`} 
              to="/locations"
            >
              Locations
            </Link>
            <Link 
              className={`nav-link ${location.pathname === '/actions' ? 'active' : ''}`} 
              to="/actions"
            >
              Actions
            </Link>
          </div>
          
          {/* User/Auth Section */}
          <div className="navbar-nav">
            {user ? (
              // Logged in user
              <div className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  👤 {user.fullName}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text">
                      <small>Logged in as</small><br/>
                      <strong>{user.username}</strong>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={onLogout}
                    >
                      🚪 Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              // Not logged in - show Login/Signup
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  🔐 Login
                </Link>
                <Link to="/signup" className="btn btn-light btn-sm">
                  📝 Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;