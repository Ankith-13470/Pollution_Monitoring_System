const express = require('express');
const router = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const [users] = await db.promise().query('SELECT * FROM SimpleUsers WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcryptjs.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.UserID, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'india_pollution_monitor_2024',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.UserID,
        username: user.username,
        email: user.email,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Register / Signup
router.post('/signup', async (req, res) => {
  const { username, email, password, fullName, full_name } = req.body;
  const full_name_value = fullName || full_name;

  if (!username || !email || !password || !full_name_value) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    const [result] = await db.promise().query(
      'INSERT INTO SimpleUsers (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, full_name_value]
    );

    res.status(201).json({
      message: 'User created successfully',
      id: result.insertId,
      username,
      email,
      full_name: full_name_value
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Register (alias for signup)
router.post('/register', async (req, res) => {
  const { username, email, password, fullName, full_name } = req.body;
  const full_name_value = fullName || full_name;

  if (!username || !email || !password || !full_name_value) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    const [result] = await db.promise().query(
      'INSERT INTO SimpleUsers (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, full_name_value]
    );

    res.status(201).json({
      message: 'User created successfully',
      id: result.insertId,
      username,
      email,
      full_name: full_name_value
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Verify token
router.post('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'india_pollution_monitor_2024');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Get current user (requires token)
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'india_pollution_monitor_2024');
    res.json(decoded);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
