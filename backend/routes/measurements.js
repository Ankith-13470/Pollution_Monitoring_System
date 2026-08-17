const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all measurements
router.get('/', async (req, res) => {
  try {
    const [measurements] = await db.promise().query(`
      SELECT m.*, l.LocationName, p.Name as PollutantName, s.SourceName
      FROM Measurement m
      JOIN Location l ON m.LocID = l.LocID
      JOIN Pollutant p ON m.PollutantID = p.PollutantID
      JOIN Source s ON m.SourceID = s.SourceID
    `);
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get critical/exceeded measurements (must come before /:id)
router.get('/critical', async (req, res) => {
  try {
    const [measurements] = await db.promise().query(`
      SELECT m.*, l.LocationName, p.Name as PollutantName, p.SafeLimit, s.SourceName
      FROM Measurement m
      JOIN Location l ON m.LocID = l.LocID
      JOIN Pollutant p ON m.PollutantID = p.PollutantID
      JOIN Source s ON m.SourceID = s.SourceID
      WHERE m.Value > p.SafeLimit
      ORDER BY m.Value DESC
      LIMIT 10
    `);
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get measurements by location
router.get('/location/:locId', async (req, res) => {
  try {
    const [measurements] = await db.promise().query(`
      SELECT m.*, l.LocationName, p.Name as PollutantName, s.SourceName
      FROM Measurement m
      JOIN Location l ON m.LocID = l.LocID
      JOIN Pollutant p ON m.PollutantID = p.PollutantID
      JOIN Source s ON m.SourceID = s.SourceID
      WHERE m.LocID = ?
    `, [req.params.locId]);
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get measurement by ID (must come after specific routes)
router.get('/:id', async (req, res) => {
  try {
    const [measurement] = await db.promise().query(`
      SELECT m.*, l.LocationName, p.Name as PollutantName, s.SourceName
      FROM Measurement m
      JOIN Location l ON m.LocID = l.LocID
      JOIN Pollutant p ON m.PollutantID = p.PollutantID
      JOIN Source s ON m.SourceID = s.SourceID
      WHERE m.MeasID = ?
    `, [req.params.id]);
    if (measurement.length === 0) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    res.json(measurement[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create measurement
router.post('/', async (req, res) => {
  const { Value, Type, DateTime, LocID, PollutantID, SourceID } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO Measurement (Value, Type, DateTime, LocID, PollutantID, SourceID) VALUES (?, ?, ?, ?, ?, ?)',
      [Value, Type, DateTime, LocID, PollutantID, SourceID]
    );
    res.status(201).json({ id: result.insertId, Value, Type, DateTime, LocID, PollutantID, SourceID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update measurement
router.put('/:id', async (req, res) => {
  const { Value, Type, DateTime, LocID, PollutantID, SourceID } = req.body;
  try {
    await db.promise().query(
      'UPDATE Measurement SET Value = ?, Type = ?, DateTime = ?, LocID = ?, PollutantID = ?, SourceID = ? WHERE MeasID = ?',
      [Value, Type, DateTime, LocID, PollutantID, SourceID, req.params.id]
    );
    res.json({ id: req.params.id, Value, Type, DateTime, LocID, PollutantID, SourceID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete measurement
router.delete('/:id', async (req, res) => {
  try {
    await db.promise().query('DELETE FROM Measurement WHERE MeasID = ?', [req.params.id]);
    res.json({ message: 'Measurement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
