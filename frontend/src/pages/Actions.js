import React, { useState, useEffect } from 'react';
import { actionAPI } from '../services/api';

const Actions = () => {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      const response = await actionAPI.getAll();
      setActions(response.data);
    } catch (error) {
      console.error('Error loading actions:', error);
    }
  };

  const getActionTypeBadge = (type) => {
    const typeColors = {
      'Warning': 'danger',
      'Regulation': 'warning',
      'Ban': 'dark',
      'Advisory': 'info',
      'Investigation': 'primary',
      'GRAP Implementation': 'danger',
      'Construction Ban': 'dark',
      'Industrial Regulation': 'warning',
      'Vehicle Restrictions': 'info',
      'Emission Standards': 'success',
      'Port Activity Regulation': 'secondary',
      'Public Transport Boost': 'primary',
      'Dust Control Measures': 'info'
    };
    return `bg-${typeColors[type] || 'secondary'}`;
  };

  const getStatusBadge = (action) => {
    const isRecent = new Date(action.ActionDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return isRecent ? 'bg-success' : 'bg-secondary';
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-success">⚡ Pollution Control Actions</h1>
          <p className="text-muted">Actions taken by pollution control authorities</p>
        </div>
      </div>

      {/* Actions List */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">📋 Recent Actions by Authorities</h5>
            </div>
            <div className="card-body">
              {actions.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Authority</th>
                        <th>Action Type</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Pollutant</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actions.map(action => (
                        <tr key={action.ActionID}>
                          <td>
                            <strong>{action.AuthorityName}</strong>
                            <br />
                            <small className="text-muted">{action.Dept}</small>
                          </td>
                          <td>
                            <span className={`badge ${getActionTypeBadge(action.Type)}`}>
                              {action.Type}
                            </span>
                          </td>
                          <td>
                            {action.Description}
                            <br />
                            <small className="text-muted">
                              Trigger: {action.PollutantName} at {action.Value} {action.Value > action.SafeLimit ? '(Exceeded)' : ''}
                            </small>
                          </td>
                          <td>
                            {action.LocationName}, {action.City}
                          </td>
                          <td>
                            <span className="badge bg-dark">{action.PollutantName}</span>
                          </td>
                          <td>
                            {new Date(action.ActionDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadge(action)}`}>
                              {new Date(action.ActionDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? 'New' : 'Completed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No actions recorded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Statistics */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">📊 Action Types Summary</h5>
            </div>
            <div className="card-body">
              {Object.entries(
                actions.reduce((acc, action) => {
                  acc[action.Type] = (acc[action.Type] || 0) + 1;
                  return acc;
                }, {})
              ).map(([type, count]) => (
                <div key={type} className="d-flex justify-content-between align-items-center mb-2">
                  <span className={`badge ${getActionTypeBadge(type)}`}>
                    {type}
                  </span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">🏛️ Authorities Involved</h5>
            </div>
            <div className="card-body">
              {Object.entries(
                actions.reduce((acc, action) => {
                  acc[action.AuthorityName] = (acc[action.AuthorityName] || 0) + 1;
                  return acc;
                }, {})
              ).map(([authority, count]) => (
                <div key={authority} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{authority}</span>
                  <span className="badge bg-primary">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actions;