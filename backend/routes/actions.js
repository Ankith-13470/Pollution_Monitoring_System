const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all actions
router.get('/', async (req, res) => {
  try {
    const [actions] = await db.promise().query(`
      SELECT 
        a.*,
        au.Name as AuthorityName,
        au.Dept,
        m.Value,
        p.Name as PollutantName,
        p.SafeLimit,
        l.LocationName,
        l.City
      FROM Actions a
      JOIN Authority au ON a.AuthID = au.AuthID
      JOIN Measurement m ON a.MeasID = m.MeasID
      JOIN Pollutant p ON m.PollutantID = p.PollutantID
      JOIN Location l ON m.LocID = l.LocID
      ORDER BY a.ActionDate DESC
    `);
    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get action by ID
router.get('/:id', async (req, res) => {
  try {
    const [action] = await db.promise().query(`
      SELECT 
        a.*,
        au.Name as AuthorityName,
        au.Dept,
        m.Value,
        p.Name as PollutantName,
        p.SafeLimit,
        l.LocationName,
        l.City
      FROM Actions a
      JOIN Authority au ON a.AuthID = au.AuthID
      JOIN Measurement m ON a.MeasID = m.MeasID
      JOIN Pollutant p ON m.PollutantID = p.PollutantID
      JOIN Location l ON m.LocID = l.LocID
      WHERE a.ActionID = ?
    `, [req.params.id]);
    if (action.length === 0) {
      return res.status(404).json({ message: 'Action not found' });
    }
    res.json(action[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create action
router.post('/', async (req, res) => {
  const { Type, Description, ActionDate, AuthID, MeasID } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO Actions (Type, Description, ActionDate, AuthID, MeasID) VALUES (?, ?, ?, ?, ?)',
      [Type, Description, ActionDate, AuthID, MeasID]
    );
    res.status(201).json({ id: result.insertId, Type, Description, ActionDate, AuthID, MeasID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update action
router.put('/:id', async (req, res) => {
  const { Type, Description, ActionDate, AuthID, MeasID } = req.body;
  try {
    await db.promise().query(
      'UPDATE Actions SET Type = ?, Description = ?, ActionDate = ?, AuthID = ?, MeasID = ? WHERE ActionID = ?',
      [Type, Description, ActionDate, AuthID, MeasID, req.params.id]
    );
    res.json({ id: req.params.id, Type, Description, ActionDate, AuthID, MeasID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete action
router.delete('/:id', async (req, res) => {
  try {
    await db.promise().query('DELETE FROM Actions WHERE ActionID = ?', [req.params.id]);
    res.json({ message: 'Action deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
