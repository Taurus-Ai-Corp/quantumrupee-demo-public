/**
 * Copyright (c) 2025 TAURUS AI Corp
 * Payment API Routes for QuantumRupee Demo
 *
 * Implements HTTP 402 Payment Required endpoints for:
 * - KYC credential generation
 * - CBDC state channel creation
 * - AI fraud detection analysis
 */

const express = require('express');
const router = express.Router();
const HTTPx402PaymentGateway = require('../payment/x402-gateway');
const BlockchainVerifier = require('../payment/blockchain-verifier');

// Initialize payment gateway and blockchain verifier
const paymentGateway = new HTTPx402PaymentGateway();
const blockchainVerifier = new BlockchainVerifier();

/**
 * POST /api/payment/challenge
 * Generate HTTP 402 payment challenge
 */
router.post('/challenge', async (req, res) => {
    try {
        const {
            resource,
            amount,
            currency = 'USDT',
            network = 'base-sepolia',
            marketSegment,
            userType,
            description
        } = req.body;

        // Validate required fields
        if (!resource || !amount) {
            return res.status(400).json({
                error: 'Missing required fields: resource, amount',
                code: 'INVALID_REQUEST'
            });
        }

        // Validate amount
        if (amount <= 0 || amount > paymentGateway.config.maxPaymentAmount) {
            return res.status(400).json({
                error: `Amount must be between 0 and ${paymentGateway.config.maxPaymentAmount}`,
                code: 'INVALID_AMOUNT'
            });
        }

        // Generate payment challenge
        const challenge = paymentGateway.generatePaymentChallenge(
            resource,
            parseFloat(amount),
            currency,
            {
                network,
                marketSegment,
                userType,
                description
            }
        );

        // Generate QR code data
        const qrData = paymentGateway.generatePaymentQRData(challenge.payment_id);

        res.status(402).json({
            ...challenge,
            qr_data: qrData,
            headers: {
                'WWW-Authenticate': `Bearer realm="${description || resource}"`,
                'Payment-Required': `x402-${currency.toLowerCase()}`,
                'Payment-Amount': amount,
                'Payment-Address': challenge.recipient_address,
                'Payment-Network': network
            }
        });

    } catch (error) {
        console.error('Payment challenge error:', error);
        res.status(500).json({
            error: 'Failed to generate payment challenge',
            code: 'CHALLENGE_ERROR',
            message: error.message
        });
    }
});

/**
 * POST /api/payment/verify
 * Verify payment transaction and grant access
 */
router.post('/verify', async (req, res) => {
    try {
        const {
            payment_id,
            transaction_hash,
            network = 'base-sepolia',
            user_id
        } = req.body;

        // Validate required fields
        if (!payment_id || !transaction_hash) {
            return res.status(400).json({
                error: 'Missing required fields: payment_id, transaction_hash',
                code: 'INVALID_REQUEST'
            });
        }

        // Get payment details
        const paymentDetails = paymentGateway.getPaymentDetails(payment_id);
        if (!paymentDetails) {
            return res.status(404).json({
                error: 'Payment not found or expired',
                code: 'PAYMENT_NOT_FOUND'
            });
        }

        // Verify transaction on blockchain
        const blockchainResult = await blockchainVerifier.verifyTransaction(
            transaction_hash,
            network,
            {
                recipient: paymentDetails.recipient_address,
                amount: paymentDetails.amount,
                currency: paymentDetails.currency
            }
        );

        if (!blockchainResult.success) {
            return res.status(400).json({
                error: 'Blockchain verification failed',
                code: 'VERIFICATION_FAILED',
                details: blockchainResult.error
            });
        }

        // Verify payment with gateway
        const paymentResult = await paymentGateway.verifyPayment(
            payment_id,
            transaction_hash,
            user_id
        );

        if (!paymentResult.success) {
            return res.status(400).json({
                error: paymentResult.error,
                code: paymentResult.code
            });
        }

        // TODO: Store in database
        // await db.paymentTransactions.create({...});

        res.status(200).json({
            success: true,
            payment_id,
            transaction_hash,
            ...paymentResult,
            blockchain: {
                network,
                explorer_url: blockchainResult.explorer_url,
                confirmations: blockchainResult.transaction.confirmations
            },
            authorization_token: payment_id // Can be used for subsequent API calls
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            error: 'Failed to verify payment',
            code: 'VERIFICATION_ERROR',
            message: error.message
        });
    }
});

/**
 * GET /api/payment/status/:paymentId
 * Get payment status
 */
router.get('/status/:paymentId', (req, res) => {
    try {
        const { paymentId } = req.params;

        const paymentDetails = paymentGateway.getPaymentDetails(paymentId);

        if (!paymentDetails) {
            return res.status(404).json({
                error: 'Payment not found',
                code: 'PAYMENT_NOT_FOUND'
            });
        }

        res.json({
            payment_id: paymentId,
            status: paymentDetails.status,
            amount: paymentDetails.amount,
            currency: paymentDetails.currency,
            resource: paymentDetails.resource,
            created_at: paymentDetails.created_at,
            expires_at: paymentDetails.expires_at,
            verified_at: paymentDetails.verified_at,
            transaction_hash: paymentDetails.transaction_hash
        });

    } catch (error) {
        console.error('Payment status error:', error);
        res.status(500).json({
            error: 'Failed to get payment status',
            code: 'STATUS_ERROR',
            message: error.message
        });
    }
});

/**
 * POST /api/payment/settlement/batch
 * Create batch settlement for offline CBDC transactions
 */
router.post('/settlement/batch', async (req, res) => {
    try {
        const {
            transactions,
            network = 'hedera-testnet'
        } = req.body;

        if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
            return res.status(400).json({
                error: 'Invalid transactions array',
                code: 'INVALID_REQUEST'
            });
        }

        // Create batch settlement
        const batchSettlement = blockchainVerifier.createBatchSettlement(transactions);

        // Estimate gas fee
        const gasFee = blockchainVerifier.estimateGasFee(network, 'state_channel_settle');

        res.json({
            success: true,
            batch_id: batchSettlement.batch_id,
            merkle_root: batchSettlement.merkle_root,
            transaction_count: batchSettlement.transaction_count,
            total_amount: batchSettlement.total_amount,
            estimated_gas_fee: gasFee,
            cost_per_transaction: (gasFee / batchSettlement.transaction_count).toFixed(8),
            savings_vs_individual: ((gasFee * (batchSettlement.transaction_count - 1)) / batchSettlement.transaction_count).toFixed(8),
            network,
            created_at: batchSettlement.created_at
        });

    } catch (error) {
        console.error('Batch settlement error:', error);
        res.status(500).json({
            error: 'Failed to create batch settlement',
            code: 'SETTLEMENT_ERROR',
            message: error.message
        });
    }
});

/**
 * GET /api/payment/history/:userId
 * Get payment history for user
 */
router.get('/history/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50, offset = 0 } = req.query;

        // TODO: Implement database query
        // For demo, return mock data
        res.json({
            user_id: userId,
            total_payments: 0,
            payments: [],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

    } catch (error) {
        console.error('Payment history error:', error);
        res.status(500).json({
            error: 'Failed to get payment history',
            code: 'HISTORY_ERROR',
            message: error.message
        });
    }
});

/**
 * GET /api/payment/statistics
 * Get payment gateway statistics
 */
router.get('/statistics', (req, res) => {
    try {
        const stats = paymentGateway.getStatistics();

        res.json({
            success: true,
            statistics: stats,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Payment statistics error:', error);
        res.status(500).json({
            error: 'Failed to get statistics',
            code: 'STATS_ERROR',
            message: error.message
        });
    }
});

/**
 * GET /api/payment/networks
 * Get supported blockchain networks
 */
router.get('/networks', (req, res) => {
    try {
        const networks = ['hedera-testnet', 'base-sepolia', 'ethereum-sepolia', 'polygon-mumbai'];
        const networkStats = networks.map(network => blockchainVerifier.getNetworkStats(network));

        res.json({
            success: true,
            networks: networkStats
        });

    } catch (error) {
        console.error('Networks error:', error);
        res.status(500).json({
            error: 'Failed to get network information',
            code: 'NETWORKS_ERROR',
            message: error.message
        });
    }
});

/**
 * POST /api/payment/estimate-fee
 * Estimate payment fees for transaction
 */
router.post('/estimate-fee', (req, res) => {
    try {
        const {
            amount,
            currency = 'USDT',
            marketSegment,
            network = 'base-sepolia',
            transactionType = 'transfer'
        } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                error: 'Invalid amount',
                code: 'INVALID_REQUEST'
            });
        }

        const feeInfo = paymentGateway.calculateFees(parseFloat(amount), currency, marketSegment);
        const gasFee = blockchainVerifier.estimateGasFee(network, transactionType);

        res.json({
            success: true,
            amount: parseFloat(amount),
            currency,
            market_segment: marketSegment,
            network,
            fee_breakdown: {
                base_fee: feeInfo.baseFee,
                discounted_fee: feeInfo.discountedFee,
                discount_amount: feeInfo.discountAmount,
                gas_fee: gasFee,
                total_fee: parseFloat((feeInfo.discountedFee + gasFee).toFixed(8))
            },
            net_amount: parseFloat((amount - feeInfo.discountedFee - gasFee).toFixed(8)),
            fee_percentage: feeInfo.feeRate
        });

    } catch (error) {
        console.error('Fee estimation error:', error);
        res.status(500).json({
            error: 'Failed to estimate fees',
            code: 'ESTIMATION_ERROR',
            message: error.message
        });
    }
});

module.exports = router;
