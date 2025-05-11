const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Submit new application
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, loan_amount, purpose } = req.body;

    // Validation
    if (!name || !email || !phone || !loan_amount || !purpose) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    const [result] = await db.execute(
      `INSERT INTO applications 
       (name, email, phone, loan_amount, purpose, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [name, email, phone, loan_amount, purpose]
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: result.insertId
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: error.code === 'ER_DUP_ENTRY' 
        ? 'Email already exists' 
        : 'Failed to submit application'
    });
  }
});

module.exports = router;