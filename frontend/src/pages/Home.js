import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-success text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Pollution Monitoring System
              </h1>
              <p className="lead mb-4">
                Real-time air quality monitoring and pollution tracking across major Indian cities. 
                <strong> Login to access detailed data, analytics, and interactive features.</strong>
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/login" className="btn btn-light btn-lg">
                  🔐 Login to Explore Data
                </Link>
                <Link to="/signup" className="btn btn-outline-light btn-lg">
                  📝 Get Started Free
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image mt-4 mt-lg-0">
                <img 
                  src="https://eduindex.org/wp-content/uploads/2021/07/air_comparison_46527c80523046a5c0b3b8e30581599a.jpg" 
                  alt="Air pollution in city with haze and buildings"
                  className="img-fluid rounded shadow-lg"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Comprehensive Pollution Monitoring</h2>
            <p className="text-muted">Track, analyze, and understand air quality data</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-6 text-primary">📊</div>
                  <h5 className="card-title mt-3">Real-time Data</h5>
                  <p className="card-text text-muted">
                    Live pollution measurements with CPCB standards from monitoring stations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-6 text-warning">🏭</div>
                  <h5 className="card-title mt-3">Source Tracking</h5>
                  <p className="card-text text-muted">
                    Identify pollution sources - industrial, vehicular, construction, and more.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-6 text-danger">⚡</div>
                  <h5 className="card-title mt-3">Government Actions</h5>
                  <p className="card-text text-muted">
                    Monitor regulatory actions by CPCB and state pollution control boards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Visualization Preview */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <img 
                src="https://www.theindianwire.com/wp-content/uploads/2021/12/jkkmkl.png" 
                alt="Pollution data visualization and analytics"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '450px', objectFit: 'cover', width: '100%' }}
              />
            </div>
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4">Advanced Analytics</h2>
              <p className="text-muted mb-4">
                Access detailed pollution analytics, trend analysis, and comparative data 
                across different cities and time periods.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2">✅ Real-time AQI monitoring</li>
                <li className="mb-2">✅ Historical trend analysis</li>
                <li className="mb-2">✅ City-wise comparisons</li>
                <li className="mb-2">✅ Pollutant concentration tracking</li>
                <li className="mb-2">✅ Regulatory compliance data</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Monitoring Cities</h2>
            <p className="text-muted">Air quality tracking across major Indian metropolitan areas</p>
          </div>
          
          <div className="row g-3 text-center">
            {[
              { name: 'Delhi', pollution: 'High' },
              { name: 'Mumbai', pollution: 'Moderate' },
              { name: 'Bengaluru', pollution: 'Moderate' },
              { name: 'Kolkata', pollution: 'High' },
              { name: 'Chennai', pollution: 'Moderate' },
              { name: 'Hyderabad', pollution: 'Moderate' },
              { name: 'Ahmedabad', pollution: 'High' },
              { name: 'Lucknow', pollution: 'High' }
            ].map(city => (
              <div key={city.name} className="col-6 col-md-3">
                <div className="p-3 bg-white rounded shadow-sm">
                  <strong>{city.name}</strong>
                  <br />
                  <small className={`text-${city.pollution === 'High' ? 'danger' : 'warning'}`}>
                    {city.pollution} Pollution
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Start Monitoring Pollution Today</h3>
          <p className="mb-4">Access real-time data, historical trends, and comprehensive analytics</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/login" className="btn btn-light btn-lg">
              🔐 Login to Dashboard
            </Link>
            <Link to="/signup" className="btn btn-outline-light btn-lg">
              📝 Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;