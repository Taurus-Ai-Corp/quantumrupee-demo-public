/**
 * QUANTUM_RUPEE (Q₹) Backend API Server
 * Neon Database Integration
 * Copyright (c) 2025 TAURUS AI Corp
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/videos', express.static('videos'));

// Neon Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_zoHWV1QdmY0A@ep-raspy-king-aeqkp587-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize Database Tables
async function initDatabase() {
    try {
        // KYC Transactions Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS kyc_transactions (
                id SERIAL PRIMARY KEY,
                aadhaar_hash VARCHAR(64) NOT NULL,
                step INTEGER NOT NULL,
                status VARCHAR(50) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata JSONB
            )
        `);

        // Offline CBDC Transactions Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cbdc_transactions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(100) NOT NULL,
                merchant_id VARCHAR(100) NOT NULL,
                amount DECIMAL(18, 2) NOT NULL,
                qr_code TEXT,
                status VARCHAR(50) NOT NULL,
                offline BOOLEAN DEFAULT true,
                settlement_hash VARCHAR(64),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Fraud Detection Logs Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS fraud_detections (
                id SERIAL PRIMARY KEY,
                file_hash VARCHAR(64) NOT NULL,
                deepfake_score DECIMAL(5, 2),
                voice_score DECIMAL(5, 2),
                behavioral_score DECIMAL(5, 2),
                overall_risk VARCHAR(20),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Database tables initialized');
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
    }
}

// API Routes

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            status: 'healthy', 
            database: 'connected',
            timestamp: result.rows[0].now 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy', 
            error: error.message 
        });
    }
});

// KYC Flow API
app.post('/api/kyc/start', async (req, res) => {
    try {
        const { aadhaar } = req.body;
        if (!aadhaar || aadhaar.length !== 12) {
            return res.status(400).json({ error: 'Invalid Aadhaar number' });
        }

        // Hash Aadhaar for privacy
        const crypto = require('crypto');
        const aadhaarHash = crypto.createHash('sha256').update(aadhaar).digest('hex');

        const result = await pool.query(
            'INSERT INTO kyc_transactions (aadhaar_hash, step, status) VALUES ($1, $2, $3) RETURNING id',
            [aadhaarHash, 1, 'started']
        );

        res.json({ 
            transactionId: result.rows[0].id,
            step: 1,
            message: 'KYC process started'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/kyc/step', async (req, res) => {
    try {
        const { transactionId, step, status } = req.body;
        
        await pool.query(
            'INSERT INTO kyc_transactions (aadhaar_hash, step, status) VALUES ($1, $2, $3)',
            [`tx_${transactionId}`, step, status]
        );

        res.json({ 
            step,
            status,
            message: `Step ${step} completed`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Offline CBDC API
app.post('/api/cbdc/generate-qr', async (req, res) => {
    try {
        const { merchantId, amount } = req.body;
        
        if (!merchantId || !amount) {
            return res.status(400).json({ error: 'Merchant ID and amount required' });
        }

        // Generate QR code data
        const qrData = JSON.stringify({
            merchantId,
            amount: parseFloat(amount),
            timestamp: Date.now(),
            type: 'offline_cbdc'
        });

        // Generate QR code image
        const qrCodeDataURL = await QRCode.toDataURL(qrData, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        // Store transaction
        const result = await pool.query(
            `INSERT INTO cbdc_transactions (user_id, merchant_id, amount, qr_code, status, offline)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            ['user_demo', merchantId, amount, qrData, 'pending', true]
        );

        res.json({
            transactionId: result.rows[0].id,
            qrCode: qrCodeDataURL,
            qrData: qrData,
            merchantId,
            amount: parseFloat(amount)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/cbdc/process-payment', async (req, res) => {
    try {
        const { transactionId, userId, qrData } = req.body;
        
        // Parse QR data
        const qrInfo = JSON.parse(qrData);
        
        // Update transaction
        await pool.query(
            `UPDATE cbdc_transactions 
             SET user_id = $1, status = $2, settlement_hash = $3
             WHERE id = $4`,
            [userId, 'completed', `settle_${Date.now()}`, transactionId]
        );

        res.json({
            success: true,
            transactionId,
            amount: qrInfo.amount,
            merchantId: qrInfo.merchantId,
            settlementHash: `settle_${Date.now()}`,
            message: 'Payment processed successfully (offline)'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/cbdc/balance/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get balance from transactions
        const result = await pool.query(
            `SELECT 
                COALESCE(SUM(CASE WHEN user_id = $1 THEN -amount ELSE 0 END), 0) as spent,
                COALESCE(SUM(CASE WHEN merchant_id = $1 THEN amount ELSE 0 END), 0) as received
             FROM cbdc_transactions
             WHERE status = 'completed'`,
            [userId]
        );

        const balance = 5000 - parseFloat(result.rows[0].spent) + parseFloat(result.rows[0].received);

        res.json({ balance: balance.toFixed(2) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fraud Detection API
app.post('/api/fraud/analyze', async (req, res) => {
    try {
        const { fileHash } = req.body;
        
        if (!fileHash) {
            return res.status(400).json({ error: 'File hash required' });
        }

        // Simulate AI analysis (in production, call actual AI model)
        const deepfakeScore = (Math.random() * 20).toFixed(2);
        const voiceScore = (Math.random() * 15).toFixed(2);
        const behavioralScore = (Math.random() * 10).toFixed(2);
        const overallRisk = parseFloat(deepfakeScore) + parseFloat(voiceScore) + parseFloat(behavioralScore);
        const riskLevel = overallRisk < 10 ? 'Low Risk' : overallRisk < 30 ? 'Medium Risk' : 'High Risk';

        // Store detection
        await pool.query(
            `INSERT INTO fraud_detections (file_hash, deepfake_score, voice_score, behavioral_score, overall_risk)
             VALUES ($1, $2, $3, $4, $5)`,
            [fileHash, deepfakeScore, voiceScore, behavioralScore, riskLevel]
        );

        res.json({
            deepfakeScore: `${deepfakeScore}%`,
            voiceScore: `${voiceScore}%`,
            behavioralScore: `${behavioralScore}%`,
            overallRisk: riskLevel,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initialize database and start server
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 QUANTUM_RUPEE (Q₹) Backend API running on port ${PORT}`);
        console.log(`📊 Database: Neon PostgreSQL`);
        console.log(`🌐 API: http://localhost:${PORT}/api`);
    });
});

module.exports = app;

