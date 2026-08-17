import React, { useState, useEffect } from 'react';
import { getStats, measurementAPI, locationAPI } from '../services/api';
import StatsCard from '../components/StatsCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMeasurements: 0,
    totalLocations: 0,
    totalPollutants: 0,
    exceededLimits: 0
  });
  const [criticalMeasurements, setCriticalMeasurements] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, criticalRes, locationsRes] = await Promise.all([
        getStats(),
        measurementAPI.getCritical(),
        locationAPI.getAll()
      ]);

      setStats(statsRes.data);
      setCriticalMeasurements(criticalRes.data);
      setCities(locationsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getAqiStatus = (city) => {
    const exceedanceRate = (city.measurementCount > 0) ? 
      (city.exceedances / city.measurementCount) * 100 : 0;
    
    if (exceedanceRate > 30) return { status: 'Poor', color: 'danger' };
    if (exceedanceRate > 15) return { status: 'Moderate', color: 'warning' };
    return { status: 'Satisfactory', color: 'success' };
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-5 fw-bold text-success">Pollution Monitor</h1>
          <p className="lead">Real-time air quality monitoring across cities</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <StatsCard 
          title="Total Measurements" 
          value={stats.totalMeasurements} 
          icon="📊" 
          color="primary"
        />
        <StatsCard 
          title="Monitoring Cities" 
          value={stats.totalLocations} 
          icon="📍" 
          color="info"
        />
        <StatsCard 
          title="Pollutants Tracked" 
          value={stats.totalPollutants} 
          icon="☁️" 
          color="warning"
        />
        <StatsCard 
          title="Limit Exceedances" 
          value={stats.exceededLimits} 
          icon="⚠️" 
          color="danger"
          subtitle="Critical alerts"
        />
      </div>

      {/* Indian Cities Overview */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">🏙️ Indian Cities Air Quality Overview</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>Location</th>
                      <th>AQI Status</th>
                      <th>Measurements</th>
                      <th>Sources</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.map(city => {
                      const aqi = getAqiStatus(city);
                      return (
                        <tr key={city.LocID}>
                          <td>
                            <strong>{city.City}</strong>
                          </td>
                          <td>
                            {city.LocationName}
                            <br />
                            <small className="text-muted">{city.Area}</small>
                          </td>
                          <td>
                            <span className={`badge bg-${aqi.color}`}>
                              {aqi.status}
                            </span>
                          </td>
                          <td>{city.measurementCount || 0}</td>
                          <td>{city.sourceCount || 0}</td>
                          <td>
                            {aqi.color === 'danger' ? 
                              <span className="text-danger">⚠️ Critical</span> :
                              aqi.color === 'warning' ?
                              <span className="text-warning">⚠️ Alert</span> :
                              <span className="text-success">✅ Normal</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Measurements */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">🚨 Recent Critical Measurements</h5>
            </div>
            <div className="card-body">
              {criticalMeasurements.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th>Pollutant</th>
                        <th>Source</th>
                        <th>Value</th>
                        <th>Safe Limit</th>
                        <th>Exceedance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criticalMeasurements.map(measurement => (
                        <tr key={measurement.MeasID} className="exceeded">
                          <td>
                            <strong>{measurement.LocationName}</strong>
                            <br />
                            <small className="text-muted">{measurement.City}</small>
                          </td>
                          <td>{measurement.PollutantName}</td>
                          <td>
                            <span className="badge bg-info">{measurement.SourceName}</span>
                          </td>
                          <td>
                            <strong className="text-danger">{measurement.Value}</strong>
                          </td>
                          <td>{measurement.SafeLimit}</td>
                          <td>
                            <span className="badge bg-danger">
                              +{((measurement.Value - measurement.SafeLimit) / measurement.SafeLimit * 100).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No critical measurements found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;