import React, { useState, useEffect } from 'react';
import { locationAPI, sourceAPI } from '../services/api';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [locationSources, setLocationSources] = useState({});
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await locationAPI.getAll();
      setLocations(response.data);
      
      // Load sources for each location
      const sourcesData = {};
      for (let location of response.data) {
        const sourceResponse = await sourceAPI.getByLocation(location.LocID);
        sourcesData[location.LocID] = sourceResponse.data;
      }
      setLocationSources(sourcesData);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const cities = ['All', ...new Set(locations.map(loc => loc.City))];
  const filteredLocations = selectedCity === 'All' 
    ? locations 
    : locations.filter(loc => loc.City === selectedCity);

  const getCityWiseStats = () => {
    const cityStats = {};
    locations.forEach(loc => {
      if (!cityStats[loc.City]) {
        cityStats[loc.City] = { locations: 0, sources: 0, measurements: 0 };
      }
      cityStats[loc.City].locations++;
      cityStats[loc.City].sources += loc.sourceCount || 0;
      cityStats[loc.City].measurements += loc.measurementCount || 0;
    });
    return cityStats;
  };

  const cityStats = getCityWiseStats();

  const formatCoordinate = (coord) => {
    if (coord === null || coord === undefined || isNaN(coord)) {
      return 'N/A';
    }
    return Number(coord).toFixed(4);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-success">📍 Monitoring Locations - Indian Cities</h1>
          <p className="text-muted">Air quality monitoring stations across major Indian cities</p>
        </div>
      </div>

      {/* City Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <label className="form-label"><strong>🏙️ Filter by City:</strong></label>
              <select 
                className="form-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">📊 City-wise Summary</h6>
              <div className="row text-center">
                {Object.entries(cityStats).slice(0, 4).map(([city, stats]) => (
                  <div key={city} className="col-3">
                    <small className="text-muted d-block">{city}</small>
                    <strong>{stats.locations}</strong>
                    <small className="text-muted d-block">sites</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="row">
        {filteredLocations.map(location => (
          <div key={location.LocID} className="col-md-6 mb-4">
            <div className="card city-card h-100">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{location.LocationName}</h5>
                  <span className="badge bg-primary">{location.City}</span>
                </div>
                <small className="text-muted">{location.Area}</small>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <strong>📍 Coordinates:</strong>
                  <p className="mb-1">
                    {formatCoordinate(location.Latitude)}°N, {formatCoordinate(location.Longitude)}°E
                  </p>
                </div>
                
                <div className="mb-3">
                  <strong>📊 Monitoring Data:</strong>
                  <div className="row text-center mt-2">
                    <div className="col-4">
                      <div className="border rounded p-2">
                        <h6 className="mb-0">{location.measurementCount || 0}</h6>
                        <small className="text-muted">Measurements</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="border rounded p-2">
                        <h6 className="mb-0">{location.sourceCount || 0}</h6>
                        <small className="text-muted">Sources</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="border rounded p-2">
                        <h6 className="mb-0 text-success">
                          {location.measurementCount ? 'Active' : 'Inactive'}
                        </h6>
                        <small className="text-muted">Status</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <strong>🏭 Pollution Sources:</strong>
                  {locationSources[location.LocID] && locationSources[location.LocID].length > 0 ? (
                    <div className="mt-2">
                      {locationSources[location.LocID].map(source => (
                        <span key={source.SourceID} className="badge bg-secondary me-1 mb-1">
                          {source.SourceName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No sources registered</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;