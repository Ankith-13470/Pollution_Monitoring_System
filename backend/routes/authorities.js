const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all authorities
router.get('/', async (req, res) => {
  try {
    const [authorities] = await db.promise().query('SELECT * FROM Authority');
    res.json(authorities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get authority by ID
router.get('/:id', async (req, res) => {
  try {
    const [authority] = await db.promise().query('SELECT * FROM Authority WHERE AuthID = ?', [req.params.id]);
    if (authority.length === 0) {
      return res.status(404).json({ message: 'Authority not found' });
    }
    res.json(authority[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create authority
router.post('/', async (req, res) => {
  const { Name, Dept, Contact, Email } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO Authority (Name, Dept, Contact, Email) VALUES (?, ?, ?, ?)',
      [Name, Dept, Contact, Email]
    );
    res.status(201).json({ id: result.insertId, Name, Dept, Contact, Email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update authority
router.put('/:id', async (req, res) => {
  const { Name, Dept, Contact, Email } = req.body;
  try {
    await db.promise().query(
      'UPDATE Authority SET Name = ?, Dept = ?, Contact = ?, Email = ? WHERE AuthID = ?',
      [Name, Dept, Contact, Email, req.params.id]
    );
    res.json({ id: req.params.id, Name, Dept, Contact, Email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete authority
router.delete('/:id', async (req, res) => {
  try {
    await db.promise().query('DELETE FROM Authority WHERE AuthID = ?', [req.params.id]);
    res.json({ message: 'Authority deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
