import React, { useState, useEffect } from 'react';
import { sourceAPI, locationAPI } from '../services/api';

const Sources = () => {
  const [sources, setSources] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadSources();
    loadLocations();
  }, []);

  const loadSources = async () => {
    try {
      const response = await sourceAPI.getAll();
      setSources(response.data);
    } catch (error) {
      console.error('Error loading sources:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await locationAPI.getAll();
      setLocations(response.data);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const getSourceTypeBadge = (type) => {
    const typeColors = {
      'Industrial': 'danger',
      'Transportation': 'warning',
      'Construction': 'info',
      'Commercial': 'success',
      'Energy': 'primary'
    };
    return `bg-${typeColors[type] || 'secondary'}`;
  };

  // Safe number formatting function
  const formatCoordinate = (coord) => {
    if (coord === null || coord === undefined || isNaN(coord)) {
      return 'N/A';
    }
    return Number(coord).toFixed(4);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-success">🏭 Pollution Sources in India</h1>
          <p className="text-muted">Major sources contributing to pollution across Indian cities</p>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="row">
        {sources.map(source => (
          <div key={source.SourceID} className="col-md-6 mb-4">
            <div className="card city-card h-100">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{source.SourceName}</h5>
                  <span className={`badge ${getSourceTypeBadge(source.SourceType)}`}>
                    {source.SourceType}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <strong>📍 Location:</strong>
                  <div>
                    {source.LocationName}, {source.City}
                    <br />
                    <small className="text-muted">{source.Area}</small>
                  </div>
                </div>
                {source.Description && (
                  <div className="mb-3">
                    <strong>📝 Description:</strong>
                    <p className="mb-0">{source.Description}</p>
                  </div>
                )}
                <div className="text-muted">
                  <small>
                    Coordinates: {formatCoordinate(source.Latitude)}, {formatCoordinate(source.Longitude)}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sources by Type Statistics */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">📊 Sources by Type</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {Object.entries(
                  sources.reduce((acc, source) => {
                    acc[source.SourceType] = (acc[source.SourceType] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([type, count]) => (
                  <div key={type} className="col-md-2 text-center mb-3">
                    <div className="border rounded p-3">
                      <h4 className={`text-${getSourceTypeBadge(type).replace('bg-', '')}`}>
                        {count}
                      </h4>
                      <small className="text-muted">{type}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sources;