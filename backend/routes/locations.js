const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const [locations] = await db.promise().query('SELECT * FROM Location');
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get location by ID
router.get('/:id', async (req, res) => {
  try {
    const [location] = await db.promise().query('SELECT * FROM Location WHERE LocID = ?', [req.params.id]);
    if (location.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create location
router.post('/', async (req, res) => {
  const { LocationName, Latitude, Longitude, City, Area } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO Location (LocationName, Latitude, Longitude, City, Area) VALUES (?, ?, ?, ?, ?)',
      [LocationName, Latitude, Longitude, City, Area]
    );
    res.status(201).json({ id: result.insertId, LocationName, Latitude, Longitude, City, Area });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update location
router.put('/:id', async (req, res) => {
  const { LocationName, Latitude, Longitude, City, Area } = req.body;
  try {
    await db.promise().query(
      'UPDATE Location SET LocationName = ?, Latitude = ?, Longitude = ?, City = ?, Area = ? WHERE LocID = ?',
      [LocationName, Latitude, Longitude, City, Area, req.params.id]
    );
    res.json({ id: req.params.id, LocationName, Latitude, Longitude, City, Area });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete location
router.delete('/:id', async (req, res) => {
  try {
    await db.promise().query('DELETE FROM Location WHERE LocID = ?', [req.params.id]);
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
