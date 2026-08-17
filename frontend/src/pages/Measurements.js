import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { measurementAPI, locationAPI, pollutantAPI, sourceAPI } from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Measurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pollutants, setPollutants] = useState([]);
  const [sources, setSources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    Value: '',
    Type: 'Air Quality',
    DateTime: new Date().toISOString().slice(0, 16),
    LocID: '',
    PollutantID: '',
    SourceID: ''
  });

  // Chart data state
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    loadMeasurements();
    loadFormData();
  }, []);

  const loadMeasurements = async () => {
    try {
      const response = await measurementAPI.getAll();
      setMeasurements(response.data);
      prepareChartData(response.data);
    } catch (error) {
      console.error('Error loading measurements:', error);
    }
  };

  const loadFormData = async () => {
    try {
      const [locRes, polRes, srcRes] = await Promise.all([
        locationAPI.getAll(),
        pollutantAPI.getAll(),
        sourceAPI.getAll()
      ]);
      setLocations(locRes.data);
      setPollutants(polRes.data);
      setSources(srcRes.data);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  // Prepare chart data from measurements
  const prepareChartData = (measurementsData) => {
    // Group measurements by pollutant and date
    const pollutantData = {};
    
    measurementsData.forEach(measurement => {
      const pollutant = measurement.PollutantName;
      const date = new Date(measurement.DateTime).toLocaleDateString();
      
      if (!pollutantData[pollutant]) {
        pollutantData[pollutant] = {};
      }
      
      if (!pollutantData[pollutant][date]) {
        pollutantData[pollutant][date] = [];
      }
      
      pollutantData[pollutant][date].push(measurement.Value);
    });

    // Get unique dates (last 7 days)
    const allDates = [...new Set(measurementsData.map(m => 
      new Date(m.DateTime).toLocaleDateString()
    ))].slice(-7);

    // Create datasets for each pollutant
    const datasets = Object.keys(pollutantData).map((pollutant, index) => {
      const colors = [
        '#dc3545', '#fd7e14', '#ffc107', '#198754', '#0dcaf0', '#6f42c1'
      ];
      
      return {
        label: pollutant,
        data: allDates.map(date => {
          const values = pollutantData[pollutant][date] || [];
          return values.length > 0 ? 
            values.reduce((a, b) => a + b, 0) / values.length : 0;
        }),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        tension: 0.4,
        fill: false
      };
    });

    const data = {
      labels: allDates,
      datasets: datasets
    };

    setChartData(data);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pollution Trends - Last 7 Days',
        font: {
          size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Pollution Level (µg/m³)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await measurementAPI.create(formData);
      setShowForm(false);
      setFormData({
        Value: '', Type: 'Air Quality', DateTime: new Date().toISOString().slice(0, 16),
        LocID: '', PollutantID: '', SourceID: ''
      });
      loadMeasurements();
      alert('✅ Measurement added successfully!');
    } catch (error) {
      console.error('Error creating measurement:', error);
      alert('❌ Error adding measurement');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = (measurement) => {
    const isExceeded = measurement.Value > measurement.SafeLimit;
    return (
      <span className={`badge ${isExceeded ? 'bg-danger' : 'bg-success'}`}>
        {isExceeded ? '🔴 Exceeded' : '🟢 Safe'}
      </span>
    );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-success">📊 Air Quality Measurements</h1>
          <p className="text-muted">Monitor pollution levels across Indian cities</p>
        </div>
        <button 
          className="btn btn-success btn-lg"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancel' : '➕ Add Measurement'}
        </button>
      </div>

      {/* Pollution Trends Chart */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">📈 Pollution Trends Analysis</h5>
            </div>
            <div className="card-body">
              {chartData ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading chart...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading pollution data...</p>
                </div>
              )}
              
              {/* Chart Insights */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6>📋 Chart Insights:</h6>
                      <ul className="list-unstyled small">
                        <li>• Shows average pollution levels over time</li>
                        <li>• Multiple pollutants can be compared</li>
                        <li>• Red line indicates critical levels</li>
                        <li>• Hover over points for detailed values</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6>🎯 How to Read:</h6>
                      <ul className="list-unstyled small">
                        <li>• <strong>X-axis:</strong> Date of measurement</li>
                        <li>• <strong>Y-axis:</strong> Pollution concentration</li>
                        <li>• <strong>Lines:</strong> Different pollutants</li>
                        <li>• <strong>Points:</strong> Individual measurements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Measurement Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">➕ Add New Measurement</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">📍 Location</label>
                    <select
                      className="form-control"
                      name="LocID"
                      value={formData.LocID}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Location</option>
                      {locations.map(location => (
                        <option key={location.LocID} value={location.LocID}>
                          {location.LocationName} - {location.City}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="mb-3">
                    <label className="form-label">☁️ Pollutant</label>
                    <select
                      className="form-control"
                      name="PollutantID"
                      value={formData.PollutantID}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Pollutant</option>
                      {pollutants.map(pollutant => (
                        <option key={pollutant.PollutantID} value={pollutant.PollutantID}>
                          {pollutant.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">🏭 Source</label>
                    <select
                      className="form-control"
                      name="SourceID"
                      value={formData.SourceID}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Source</option>
                      {sources.map(source => (
                        <option key={source.SourceID} value={source.SourceID}>
                          {source.SourceName} ({source.SourceType})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="mb-3">
                    <label className="form-label">📈 Value</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="Value"
                      value={formData.Value}
                      onChange={handleChange}
                      placeholder="e.g., 45.5"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="mb-3">
                    <label className="form-label">📅 Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="DateTime"
                      value={formData.DateTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label">📋 Type</label>
                    <select
                      className="form-control"
                      name="Type"
                      value={formData.Type}
                      onChange={handleChange}
                      required
                    >
                      <option value="Air Quality">Air Quality</option>
                      <option value="Water Quality">Water Quality</option>
                      <option value="Soil Quality">Soil Quality</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="mb-3 d-flex align-items-end h-100">
                    <button type="submit" className="btn btn-success me-2">
                      ✅ Add Measurement
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Measurements Table */}
      <div className="card">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">📋 All Measurements</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Pollutant</th>
                  <th>Source</th>
                  <th>Value</th>
                  <th>Safe Limit</th>
                  <th>Type</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map(measurement => (
                  <tr key={measurement.MeasID} className={measurement.Value > measurement.SafeLimit ? 'table-danger' : ''}>
                    <td>
                      <strong>{measurement.LocationName}</strong>
                      <br />
                      <small className="text-muted">{measurement.City}, {measurement.Area}</small>
                    </td>
                    <td>{measurement.PollutantName}</td>
                    <td>
                      <span className="badge bg-secondary">{measurement.SourceName}</span>
                      <br />
                      <small className="text-muted">{measurement.SourceType}</small>
                    </td>
                    <td>
                      <strong className={measurement.Value > measurement.SafeLimit ? 'text-danger' : 'text-success'}>
                        {measurement.Value}
                      </strong>
                    </td>
                    <td>{measurement.SafeLimit}</td>
                    <td>{measurement.Type}</td>
                    <td>{new Date(measurement.DateTime).toLocaleString()}</td>
                    <td>{getStatusBadge(measurement)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Measurements;