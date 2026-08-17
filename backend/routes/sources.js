const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all sources
router.get('/', async (req, res) => {
  try {
    const [sources] = await db.promise().query(`
      SELECT s.*, l.LocationName, l.Latitude, l.Longitude, l.City, l.Area
      FROM Source s
      LEFT JOIN Location l ON s.LocID = l.LocID
    `);
    res.json(sources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get source by ID
router.get('/:id', async (req, res) => {
  try {
    const [source] = await db.promise().query(`
      SELECT s.*, l.LocationName, l.Latitude, l.Longitude, l.City, l.Area
      FROM Source s
      LEFT JOIN Location l ON s.LocID = l.LocID
      WHERE s.SourceID = ?
    `, [req.params.id]);
    if (source.length === 0) {
      return res.status(404).json({ message: 'Source not found' });
    }
    res.json(source[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create source
router.post('/', async (req, res) => {
  const { SourceName, SourceType, Description, LocID } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO Source (SourceName, SourceType, Description, LocID) VALUES (?, ?, ?, ?)',
      [SourceName, SourceType, Description, LocID]
    );
    res.status(201).json({ id: result.insertId, SourceName, SourceType, Description, LocID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update source
router.put('/:id', async (req, res) => {
  const { SourceName, SourceType, Description, LocID } = req.body;
  try {
    await db.promise().query(
      'UPDATE Source SET SourceName = ?, SourceType = ?, Description = ?, LocID = ? WHERE SourceID = ?',
      [SourceName, SourceType, Description, LocID, req.params.id]
    );
    res.json({ id: req.params.id, SourceName, SourceType, Description, LocID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete source
router.delete('/:id', async (req, res) => {
  try {
    await db.promise().query('DELETE FROM Source WHERE SourceID = ?', [req.params.id]);
    res.json({ message: 'Source deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
