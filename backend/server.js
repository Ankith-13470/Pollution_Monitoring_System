const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const locationsRoutes = require('./routes/locations');
const sourcesRoutes = require('./routes/sources');
const pollutantsRoutes = require('./routes/pollutants');
const measurementsRoutes = require('./routes/measurements');
const actionsRoutes = require('./routes/actions');
const authoritiesRoutes = require('./routes/authorities');
const simpleAuthRoutes = require('./routes/simpleauth');

// Use routes
app.use('/api/locations', locationsRoutes);
app.use('/api/sources', sourcesRoutes);
app.use('/api/pollutants', pollutantsRoutes);
app.use('/api/measurements', measurementsRoutes);
app.use('/api/actions', actionsRoutes);
app.use('/api/authorities', authoritiesRoutes);
app.use('/api/auth', simpleAuthRoutes);

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  const db = require('./config/database');
  
  try {
    const [measurements] = await db.promise().query('SELECT COUNT(*) as total FROM Measurement');
    const [locations] = await db.promise().query('SELECT COUNT(*) as total FROM Location');
    const [pollutants] = await db.promise().query('SELECT COUNT(*) as total FROM Pollutant');
    const [exceeded] = await db.promise().query(`
      SELECT COUNT(*) as total FROM Measurement m 
      JOIN Pollutant p ON m.PollutantID = p.PollutantID 
      WHERE m.Value > p.SafeLimit
    `);

    res.json({
      totalMeasurements: measurements[0].total,
      totalLocations: locations[0].total,
      totalPollutants: pollutants[0].total,
      exceededLimits: exceeded[0].total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: '🇮🇳 India Pollution Monitoring System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      locations: '/api/locations',
      measurements: '/api/measurements',
      stats: '/api/stats'
    }
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
  console.log(`📊 Frontend: http://localhost:3000`);
});