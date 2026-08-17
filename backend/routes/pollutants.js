const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all pollutants
router.get('/', async (req, res) => {
  try {
    const [pollutants] = await db.promise().query('SELECT * FROM Pollutant');
    res.json(pollutants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pollutant statistics
router.get('/stats', async (req, res) => {
  try {
    const [stats] = await db.promise().query(`
      SELECT 
        p.PollutantID,
        p.Name,
        p.SafeLimit,
        COUNT(m.MeasID) as totalMeasurements,
        SUM(CASE WHEN m.Value > p.SafeLimit THEN 1 ELSE 0 END) as exceedances,
        AVG(m.Value) as averageValue,
        MAX(m.Value) as maxValue,
        MIN(m.Value) as minValue
      FROM Pollutant p
      LEFT JOIN Measurement m ON p.PollutantID = m.PollutantID
      GROUP BY p.PollutantID, p.Name, p.SafeLimit
      ORDER BY exceedances DESC
    `);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pollutant by ID
router.get('/:id', async (req, res) => {
  try {
    const [pollutant] = await db.promise().query('SELECT * FROM Pollutant WHERE PollutantID = ?', [req.params.id]);
    if (pollutant.length === 0) {
      return res.status(404).json({ message: 'Pollutant not found' });
    }
    res.json(pollutant[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create pollutant
router.post('/', async (req, res) => {
  const { Name, SafeLimit, Description } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO Pollutant (Name, SafeLimit, Description) VALUES (?, ?, ?)',
      [Name, SafeLimit, Description]
    );
    res.status(201).json({ id: result.insertId, Name, SafeLimit, Description });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update pollutant
router.put('/:id', async (req, res) => {
  const { Name, SafeLimit, Description } = req.body;
  try {
    await db.promise().query(
      'UPDATE Pollutant SET Name = ?, SafeLimit = ?, Description = ? WHERE PollutantID = ?',
      [Name, SafeLimit, Description, req.params.id]
    );
    res.json({ id: req.params.id, Name, SafeLimit, Description });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete pollutant
router.delete('/:id', async (req, res) => {
  try {
    await db.promise().query('DELETE FROM Pollutant WHERE PollutantID = ?', [req.params.id]);
    res.json({ message: 'Pollutant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
