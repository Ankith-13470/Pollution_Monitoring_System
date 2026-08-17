import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { pollutantAPI } from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Pollutants = () => {
  const [pollutants, setPollutants] = useState([]);
  const [pollutantStats, setPollutantStats] = useState([]);

  // Chart data states
  const [exceedanceChartData, setExceedanceChartData] = useState(null);
  const [safeLimitChartData, setSafeLimitChartData] = useState(null);

  useEffect(() => {
    loadPollutants();
  }, []);

  const loadPollutants = async () => {
    try {
      const [pollutantsRes, statsRes] = await Promise.all([
        pollutantAPI.getAll(),
        pollutantAPI.getStats()
      ]);
      setPollutants(pollutantsRes.data);
      setPollutantStats(statsRes.data);
      prepareChartData(pollutantsRes.data, statsRes.data);
    } catch (error) {
      console.error('Error loading pollutants:', error);
    }
  };

  // Prepare chart data
  const prepareChartData = (pollutantsData, statsData) => {
    // Doughnut Chart - Exceedance Distribution
    const exceedanceData = {
      labels: pollutantsData.map(p => p.Name),
      datasets: [
        {
          label: 'Limit Exceedances',
          data: pollutantsData.map(pollutant => {
            const stat = statsData.find(s => s.PollutantID === pollutant.PollutantID);
            return stat ? stat.exceedances : 0;
          }),
          backgroundColor: [
            '#dc3545', // PM2.5 - Red
            '#fd7e14', // PM10 - Orange
            '#ffc107', // NO2 - Yellow
            '#20c997', // SO2 - Teal
            '#0dcaf0', // CO - Cyan
            '#6f42c1', // O3 - Purple
            '#e83e8c'  // NH3 - Pink
          ],
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 15
        }
      ]
    };

    // Bar Chart - Safe Limits vs Average Values
    const safeLimitData = {
      labels: pollutantsData.map(p => p.Name),
      datasets: [
        {
          label: 'Safe Limit (CPCB)',
          data: pollutantsData.map(p => p.SafeLimit),
          backgroundColor: '#28a745',
          borderColor: '#28a745',
          borderWidth: 1
        },
        {
          label: 'Average Measured Value',
          data: pollutantsData.map(pollutant => {
            const stat = statsData.find(s => s.PollutantID === pollutant.PollutantID);
            return stat && stat.averageValue ? stat.averageValue : 0;
          }),
          backgroundColor: '#dc3545',
          borderColor: '#dc3545',
          borderWidth: 1
        }
      ]
    };

    setExceedanceChartData(exceedanceData);
    setSafeLimitChartData(safeLimitData);
  };

  // Chart options
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Pollutant Limit Exceedance Distribution',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} exceedances (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%'
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Safe Limits vs Average Measured Values',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Concentration (µg/m³)'
        }
      }
    }
  };

  const getStatusColor = (pollutant) => {
    const stat = pollutantStats.find(p => p.PollutantID === pollutant.PollutantID);
    if (!stat || stat.measurementCount === 0) return 'secondary';
    
    const exceedanceRate = (stat.exceedances / stat.measurementCount) * 100;
    if (exceedanceRate > 30) return 'danger';
    if (exceedanceRate > 15) return 'warning';
    return 'success';
  };

  const getStatForPollutant = (pollutantId) => {
    return pollutantStats.find(p => p.PollutantID === pollutantId);
  };

  // Safe number formatting function
  const formatNumber = (num, decimals = 1) => {
    if (num === null || num === undefined || isNaN(num)) {
      return '0.0';
    }
    return Number(num).toFixed(decimals);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-success">☁️ Pollutants Being Monitored</h1>
          <p className="text-muted">Air quality parameters and their safe limits as per CPCB standards</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        {/* Exceedance Distribution Chart */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">📊 Limit Exceedance Analysis</h5>
            </div>
            <div className="card-body">
              {exceedanceChartData ? (
                <Doughnut data={exceedanceChartData} options={doughnutOptions} />
              ) : (
                <div className="text-center py-4">
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading chart...</span>
                  </div>
                </div>
              )}
              <div className="mt-3">
                <small className="text-muted">
                  Shows distribution of safety limit exceedances across different pollutants
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Safe Limits vs Average Values Chart */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">⚖️ Standards Compliance</h5>
            </div>
            <div className="card-body">
              {safeLimitChartData ? (
                <Bar data={safeLimitChartData} options={barOptions} />
              ) : (
                <div className="text-center py-4">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading chart...</span>
                  </div>
                </div>
              )}
              <div className="mt-3">
                <small className="text-muted">
                  Compares CPCB safe limits with actual measured average values
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <div className="display-6">🔴</div>
              <h5>Critical Pollutants</h5>
              <p className="mb-0">PM2.5 & PM10 show highest exceedance rates</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark">
            <div className="card-body text-center">
              <div className="display-6">🟡</div>
              <h5>Moderate Levels</h5>
              <p className="mb-0">NO2 & SO2 within acceptable ranges</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <div className="display-6">🟢</div>
              <h5>Within Limits</h5>
              <p className="mb-0">CO & O3 generally below safe thresholds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pollutants Grid */}
      <div className="row">
        {pollutants.map(pollutant => {
          const stat = getStatForPollutant(pollutant.PollutantID);
          const statusColor = getStatusColor(pollutant);
          const exceedanceRate = stat && stat.measurementCount > 0 ? 
            (stat.exceedances / stat.measurementCount) * 100 : 0;
          
          return (
            <div key={pollutant.PollutantID} className="col-md-6 mb-4">
              <div className="card city-card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{pollutant.Name}</h5>
                  <span className={`badge bg-${statusColor}`}>
                    {statusColor === 'danger' ? '🔴 Critical' : 
                     statusColor === 'warning' ? '🟡 Alert' : '🟢 Normal'}
                  </span>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>🛡️ Safe Limit:</strong>
                    <h4 className={`text-${statusColor} mt-1`}>
                      {pollutant.SafeLimit} {pollutant.SafeLimit < 10 ? 'mg/m³' : 'µg/m³'}
                    </h4>
                  </div>
                  
                  {pollutant.Description && (
                    <div className="mb-3">
                      <strong>📝 Description:</strong>
                      <p className="mb-2">{pollutant.Description}</p>
                    </div>
                  )}

                  {stat && (
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="border rounded p-2">
                          <h6 className="mb-0">{stat.measurementCount || 0}</h6>
                          <small className="text-muted">Measurements</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="border rounded p-2">
                          <h6 className="mb-0">{formatNumber(stat.averageValue)}</h6>
                          <small className="text-muted">Average</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="border rounded p-2">
                          <h6 className={`mb-0 ${stat.exceedances > 0 ? 'text-danger' : 'text-success'}`}>
                            {stat.exceedances || 0}
                          </h6>
                          <small className="text-muted">Exceedances</small>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Exceedance Rate Progress Bar */}
                  {stat && stat.measurementCount > 0 && (
                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Exceedance Rate:</small>
                        <small>{exceedanceRate.toFixed(1)}%</small>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className={`progress-bar bg-${statusColor}`}
                          style={{ width: `${Math.min(exceedanceRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">📈 Pollution Statistics Summary</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <h3 className="text-primary">{pollutants.length}</h3>
                  <small className="text-muted">Pollutants Tracked</small>
                </div>
                <div className="col-md-3">
                  <h3 className="text-warning">
                    {pollutantStats.reduce((sum, stat) => sum + (stat.exceedances || 0), 0)}
                  </h3>
                  <small className="text-muted">Total Exceedances</small>
                </div>
                <div className="col-md-3">
                  <h3 className="text-info">
                    {pollutantStats.reduce((sum, stat) => sum + (stat.measurementCount || 0), 0)}
                  </h3>
                  <small className="text-muted">Total Measurements</small>
                </div>
                <div className="col-md-3">
                  <h3 className="text-success">
                    {pollutants.filter(p => {
                      const stat = getStatForPollutant(p.PollutantID);
                      const rate = stat && stat.measurementCount > 0 ? 
                        (stat.exceedances / stat.measurementCount) * 100 : 0;
                      return rate < 10;
                    }).length}
                  </h3>
                  <small className="text-muted">Pollutants Within Limits</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pollutants;