import React, { useState } from 'react';

const SimpleAuth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '', 
    password: '', 
    email: '', 
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
    setMessage(''); // Clear message when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Login successful
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          onLogin(data.user);
          setMessage('Login successful! Redirecting...');
        } else {
          // Signup successful
          setMessage('✅ ' + data.message);
          // Clear form
          setFormData({ 
            username: '', 
            password: '', 
            email: '', 
            fullName: '' 
          });
          // Optionally switch to login
          setTimeout(() => setIsLogin(true), 2000);
        }
      } else {
        setMessage('❌ ' + (data.message || 'Something went wrong'));
      }
    } catch (error) {
      setMessage('❌ Network error. Make sure backend is running on port 5000.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center text-success mb-4">
            Pollution Monitor
          </h2>
          <p className="text-center text-muted mb-4">
            {isLogin ? 'Login to access pollution data' : 'Create your account'}
          </p>
          
          {message && (
            <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} mb-3`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-success w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {isLogin ? 'Logging in...' : 'Signing up...'}
                </>
              ) : (
                isLogin ? '🔐 Login' : '📝 Sign Up'
              )}
            </button>
          </form>

          <div className="text-center">
            <button 
            className="btn btn-link text-decoration-none p-0"
    onClick={() => {
      const newIsLogin = !isLogin;
      setIsLogin(newIsLogin);
      setMessage('');
      setFormData({
        username: '', 
        password: '', 
        email: '', 
        fullName: ''
      });
      // Update URL without page reload
      window.history.replaceState(null, '', newIsLogin ? '/login' : '/signup');
    }}
  >
    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
  </button>
</div>

          {isLogin && (
            <div className="mt-3 p-3 bg-light rounded text-center">
              <small className="text-muted">
                <strong>Demo Account:</strong><br/>
                Username: <code>demo</code><br/>
                Password: <code>demo123</code>
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleAuth;