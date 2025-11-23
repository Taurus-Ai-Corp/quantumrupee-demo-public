/**
 * Copyright (c) 2025 TAURUS AI Corp
 * HTTP x402 Payment Gateway for QuantumRupee Demo
 *
 * Implements HTTP 402 Payment Required authentication for:
 * - Tokenized KYC credential generation
 * - Offline CBDC state channel creation
 * - AI fraud detection analysis
 */

const crypto = require('crypto');

class HTTPx402PaymentGateway {
    constructor(config = {}) {
        this.config = {
            gatewayAddress: config.gatewayAddress || process.env.PAYMENT_GATEWAY_ADDRESS,
            blockchainRPC: config.blockchainRPC || process.env.BLOCKCHAIN_RPC_URL,
            paymentTimeout: config.paymentTimeout || parseInt(process.env.PAYMENT_TIMEOUT_SECONDS || '300'),
            maxPaymentAmount: config.maxPaymentAmount || parseFloat(process.env.MAX_PAYMENT_AMOUNT || '1000.0'),
            feePercentageDefault: config.feePercentageDefault || parseFloat(process.env.FEE_PERCENTAGE_DEFAULT || '0.1'),

            // Market segment discounts
            discounts: {
                india_farmers: parseFloat(process.env.FEE_DISCOUNT_INDIA_FARMERS || '0.7'),
                canada_indigenous: parseFloat(process.env.FEE_DISCOUNT_CANADA_INDIGENOUS || '0.5'),
                migrant_workers: parseFloat(process.env.FEE_DISCOUNT_MIGRANT_WORKERS || '0.8')
            }
        };

        // In-memory payment cache (replace with Redis in production)
        this.pendingPayments = new Map();
        this.completedPayments = new Map();
    }

    /**
     * Calculate payment fees with market-specific discounts
     */
    calculateFees(amount, currency = 'USDT', marketSegment = null) {
        const baseFeeRate = this.config.feePercentageDefault;
        const baseFee = amount * (baseFeeRate / 100);

        let discount = 0;
        if (marketSegment && this.config.discounts[marketSegment]) {
            discount = this.config.discounts[marketSegment];
        }

        const discountedFee = baseFee * (1 - discount);

        return {
            baseFee: parseFloat(baseFee.toFixed(8)),
            discountedFee: parseFloat(discountedFee.toFixed(8)),
            discountAmount: parseFloat((baseFee - discountedFee).toFixed(8)),
            netAmount: parseFloat((amount - discountedFee).toFixed(8)),
            feeRate: parseFloat((baseFeeRate * (1 - discount)).toFixed(4))
        };
    }

    /**
     * Generate HTTP 402 payment challenge
     */
    generatePaymentChallenge(resourcePath, amount, currency = 'USDT', metadata = {}) {
        const paymentId = `x402_${crypto.randomBytes(6).toString('hex')}`;
        const expiresAt = new Date(Date.now() + (this.config.paymentTimeout * 1000));

        const feeInfo = this.calculateFees(amount, currency, metadata.marketSegment);

        const challenge = {
            payment_id: paymentId,
            resource: resourcePath,
            amount: amount,
            currency: currency,
            recipient_address: this.config.gatewayAddress,
            network: metadata.network || 'base-sepolia',
            expires_at: expiresAt.toISOString(),
            fee_info: feeInfo,
            metadata: {
                market_segment: metadata.marketSegment,
                user_type: metadata.userType,
                resource_description: metadata.description
            }
        };

        // Store in pending payments
        this.pendingPayments.set(paymentId, {
            ...challenge,
            status: 'pending',
            created_at: new Date().toISOString()
        });

        // Set cleanup timeout
        setTimeout(() => {
            if (this.pendingPayments.has(paymentId)) {
                this.pendingPayments.delete(paymentId);
            }
        }, this.config.paymentTimeout * 1000);

        return challenge;
    }

    /**
     * Verify payment transaction
     * In demo mode, this simulates blockchain verification
     * In production, this would verify actual on-chain transactions
     */
    async verifyPayment(paymentId, transactionHash, userId = null) {
        const pending = this.pendingPayments.get(paymentId);

        if (!pending) {
            return {
                success: false,
                error: 'Payment not found or expired',
                code: 'PAYMENT_NOT_FOUND'
            };
        }

        // Check expiration
        if (new Date() > new Date(pending.expires_at)) {
            this.pendingPayments.delete(paymentId);
            return {
                success: false,
                error: 'Payment challenge expired',
                code: 'PAYMENT_EXPIRED'
            };
        }

        // DEMO MODE: Simulate blockchain verification
        // In production, replace with actual blockchain RPC calls
        const isValidTransaction = await this.simulateBlockchainVerification(
            transactionHash,
            pending.recipient_address,
            pending.amount,
            pending.currency
        );

        if (!isValidTransaction) {
            return {
                success: false,
                error: 'Transaction verification failed',
                code: 'VERIFICATION_FAILED'
            };
        }

        // Move to completed payments
        const completedPayment = {
            ...pending,
            transaction_hash: transactionHash,
            user_id: userId,
            status: 'completed',
            verified_at: new Date().toISOString(),
            block_confirmation: 1 // Simulated
        };

        this.completedPayments.set(paymentId, completedPayment);
        this.pendingPayments.delete(paymentId);

        return {
            success: true,
            payment_id: paymentId,
            transaction_hash: transactionHash,
            net_amount: pending.fee_info.netAmount,
            processing_fee: pending.fee_info.discountedFee,
            verified_at: completedPayment.verified_at
        };
    }

    /**
     * Simulate blockchain transaction verification
     * In production, this would make actual RPC calls to verify on-chain data
     */
    async simulateBlockchainVerification(txHash, expectedRecipient, expectedAmount, expectedCurrency) {
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Validate transaction hash format (0x + 64 hex characters)
        const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
        if (!txHashRegex.test(txHash)) {
            return false;
        }

        // In demo mode, all properly formatted transactions are considered valid
        // In production, replace with:
        // const provider = new ethers.providers.JsonRpcProvider(this.config.blockchainRPC);
        // const receipt = await provider.getTransactionReceipt(txHash);
        // return receipt && receipt.to === expectedRecipient && ...

        return true;
    }

    /**
     * Check if payment is authorized for resource access
     */
    isPaymentAuthorized(paymentId) {
        const completed = this.completedPayments.get(paymentId);
        return completed && completed.status === 'completed';
    }

    /**
     * Get payment details
     */
    getPaymentDetails(paymentId) {
        return this.completedPayments.get(paymentId) || this.pendingPayments.get(paymentId) || null;
    }

    /**
     * Generate QR code data for payment
     */
    generatePaymentQRData(paymentId) {
        const pending = this.pendingPayments.get(paymentId);
        if (!pending) {
            return null;
        }

        return {
            payment_id: paymentId,
            recipient: pending.recipient_address,
            amount: pending.amount,
            currency: pending.currency,
            network: pending.metadata.network || 'base-sepolia',
            expires_at: pending.expires_at
        };
    }

    /**
     * Get payment statistics
     */
    getStatistics() {
        const completed = Array.from(this.completedPayments.values());

        const totalPayments = completed.length;
        const totalVolume = completed.reduce((sum, p) => sum + p.amount, 0);
        const totalFees = completed.reduce((sum, p) => sum + p.fee_info.discountedFee, 0);
        const totalSavings = completed.reduce((sum, p) => sum + p.fee_info.discountAmount, 0);

        return {
            total_payments: totalPayments,
            total_volume: parseFloat(totalVolume.toFixed(2)),
            total_fees: parseFloat(totalFees.toFixed(8)),
            total_savings: parseFloat(totalSavings.toFixed(8)),
            average_transaction: totalPayments > 0 ? parseFloat((totalVolume / totalPayments).toFixed(2)) : 0,
            pending_payments: this.pendingPayments.size
        };
    }
}

module.exports = HTTPx402PaymentGateway;
