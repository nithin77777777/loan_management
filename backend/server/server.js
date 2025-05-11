// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors({ origin: 'http://localhost:5500' }));
app.use(express.json());

// Database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'loan_manager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// API Endpoints
app.post('/api/applications', async (req, res) => {
    try {
        const { name, email, phone, loan_amount, purpose } = req.body;
        
        // Validation
        if (!name || !email || !phone || !loan_amount || !purpose) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Insert application
        const [result] = await pool.query(
            `INSERT INTO applications 
            (name, email, phone, loan_amount, purpose, status) 
            VALUES (?, ?, ?, ?, ?, 'pending')`,
            [name, email, phone, loan_amount, purpose]
        );

        res.status(201).json({
            success: true,
            applicationId: result.insertId
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            error: error.code === 'ER_DUP_ENTRY' 
                ? 'Email already exists' 
                : 'Server error'
        });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(status = 'approved') as approved,
                SUM(status = 'pending') as pending,
                SUM(status = 'rejected') as rejected,
                AVG(loan_amount) as avgLoan
            FROM applications
        `);
        
        res.json({
            total: rows[0].total,
            approved: rows[0].approved,
            pending: rows[0].pending,
            rejected: rows[0].rejected,
            avgLoan: rows[0].avgLoan || 0
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to load statistics' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));