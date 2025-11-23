/**
 * Copyright (c) 2025 TAURUS AI Corp
 * Frontend Payment Module for QuantumRupee Demo
 * HTTP x402 Payment Integration
 */

class PaymentModule {
    constructor(apiUrl = 'http://localhost:3000') {
        this.apiUrl = apiUrl;
        this.currentPayment = null;
        this.paymentModal = null;
        this.qrCodeInstance = null;

        this.init();
    }

    /**
     * Initialize payment module
     */
    init() {
        // Create payment modal HTML
        this.createPaymentModal();

        // Listen for payment events
        document.addEventListener('initiate-payment', (e) => {
            this.initiatePayment(e.detail);
        });
    }

    /**
     * Create payment modal DOM structure
     */
    createPaymentModal() {
        const modalHTML = `
            <div id="payment-modal" class="payment-modal hidden">
                <div class="payment-modal-overlay" onclick="paymentModule.closePaymentModal()"></div>
                <div class="payment-modal-content">
                    <button class="payment-modal-close" onclick="paymentModule.closePaymentModal()">
                        <i class="fas fa-times"></i>
                    </button>

                    <div id="payment-step-challenge" class="payment-step active">
                        <h2>💳 Payment Required</h2>
                        <div class="payment-resource-info">
                            <p class="resource-description"></p>
                        </div>

                        <div class="payment-amount-display">
                            <div class="amount-label">Amount:</div>
                            <div class="amount-value"></div>
                        </div>

                        <div class="payment-fee-breakdown">
                            <div class="fee-item">
                                <span>Base Fee:</span>
                                <span class="fee-base"></span>
                            </div>
                            <div class="fee-item discount">
                                <span>Discount:</span>
                                <span class="fee-discount"></span>
                            </div>
                            <div class="fee-item">
                                <span>Processing Fee:</span>
                                <span class="fee-processing"></span>
                            </div>
                            <div class="fee-item total">
                                <span>You Receive:</span>
                                <span class="fee-net"></span>
                            </div>
                        </div>

                        <div class="payment-qr-section">
                            <canvas id="payment-qr-code"></canvas>
                            <p class="qr-instruction">Scan with crypto wallet to pay</p>
                        </div>

                        <div class="payment-address-section">
                            <label>Or send to address:</label>
                            <div class="address-display">
                                <code id="payment-address"></code>
                                <button class="btn-copy" onclick="paymentModule.copyAddress()">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>

                        <div class="payment-network-info">
                            <span class="network-badge"></span>
                            <span class="currency-badge"></span>
                        </div>

                        <div class="payment-timer">
                            <i class="fas fa-clock"></i>
                            <span id="payment-countdown">5:00</span>
                        </div>

                        <button class="btn btn-primary" onclick="paymentModule.showTransactionInput()">
                            I've Sent Payment
                        </button>
                    </div>

                    <div id="payment-step-verify" class="payment-step">
                        <h2>🔍 Verify Payment</h2>
                        <p>Enter your transaction hash to verify payment:</p>

                        <div class="transaction-input">
                            <input
                                type="text"
                                id="transaction-hash-input"
                                placeholder="0x..."
                                class="form-input"
                            />
                            <button class="btn btn-primary" onclick="paymentModule.verifyPayment()">
                                Verify Transaction
                            </button>
                        </div>

                        <div class="demo-mode-notice">
                            <i class="fas fa-info-circle"></i>
                            <p><strong>Demo Mode:</strong> For demonstration purposes, you can use a simulated transaction hash. In production, this would verify an actual blockchain transaction.</p>
                            <button class="btn btn-outline btn-sm" onclick="paymentModule.simulatePayment()">
                                Simulate Payment (Demo)
                            </button>
                        </div>

                        <div id="verification-status" class="verification-status hidden">
                            <div class="status-icon"></div>
                            <div class="status-message"></div>
                        </div>
                    </div>

                    <div id="payment-step-success" class="payment-step">
                        <div class="success-animation">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>✅ Payment Verified!</h2>
                        <div class="payment-receipt">
                            <div class="receipt-item">
                                <span>Payment ID:</span>
                                <code id="receipt-payment-id"></code>
                            </div>
                            <div class="receipt-item">
                                <span>Transaction Hash:</span>
                                <code id="receipt-tx-hash"></code>
                            </div>
                            <div class="receipt-item">
                                <span>Amount Paid:</span>
                                <span id="receipt-amount"></span>
                            </div>
                            <div class="receipt-item">
                                <span>Network:</span>
                                <span id="receipt-network"></span>
                            </div>
                            <div class="receipt-item">
                                <span>Status:</span>
                                <span class="badge-success">Confirmed</span>
                            </div>
                        </div>

                        <a id="receipt-explorer-link" href="#" target="_blank" class="btn btn-outline">
                            <i class="fas fa-external-link-alt"></i> View on Explorer
                        </a>

                        <button class="btn btn-primary" onclick="paymentModule.completePayment()">
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.paymentModal = document.getElementById('payment-modal');
    }

    /**
     * Initiate payment flow
     */
    async initiatePayment(paymentRequest) {
        try {
            const {
                resource,
                amount,
                currency = 'USDT',
                network = 'base-sepolia',
                marketSegment,
                description,
                onSuccess
            } = paymentRequest;

            // Store callback
            this.onPaymentSuccess = onSuccess;

            // Request payment challenge from backend
            const response = await fetch(`${this.apiUrl}/api/payment/challenge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resource,
                    amount,
                    currency,
                    network,
                    marketSegment,
                    description
                })
            });

            const challenge = await response.json();
            this.currentPayment = challenge;

            // Display payment modal
            this.displayPaymentChallenge(challenge);
            this.openPaymentModal();

            // Start countdown timer
            this.startCountdown(challenge.expires_at);

        } catch (error) {
            console.error('Payment initiation error:', error);
            this.showError('Failed to initiate payment. Please try again.');
        }
    }

    /**
     * Display payment challenge in modal
     */
    displayPaymentChallenge(challenge) {
        // Update resource description
        document.querySelector('.resource-description').textContent = challenge.metadata.description || challenge.resource;

        // Update amount
        document.querySelector('.amount-value').textContent = `${challenge.amount} ${challenge.currency}`;

        // Update fee breakdown
        document.querySelector('.fee-base').textContent = `$${challenge.fee_info.baseFee.toFixed(8)}`;
        document.querySelector('.fee-discount').textContent = `-$${challenge.fee_info.discountAmount.toFixed(8)}`;
        document.querySelector('.fee-processing').textContent = `$${challenge.fee_info.discountedFee.toFixed(8)}`;
        document.querySelector('.fee-net').textContent = `$${challenge.fee_info.netAmount.toFixed(2)} ${challenge.currency}`;

        // Update network and currency badges
        document.querySelector('.network-badge').textContent = challenge.network.toUpperCase();
        document.querySelector('.currency-badge').textContent = challenge.currency;

        // Update payment address
        document.getElementById('payment-address').textContent = challenge.recipient_address;

        // Generate QR code
        this.generateQRCode(challenge.qr_data);
    }

    /**
     * Generate QR code for payment
     */
    generateQRCode(qrData) {
        const canvas = document.getElementById('payment-qr-code');
        const qrString = JSON.stringify(qrData);

        QRCode.toCanvas(canvas, qrString, {
            width: 250,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, (error) => {
            if (error) console.error('QR code generation error:', error);
        });
    }

    /**
     * Start payment expiration countdown
     */
    startCountdown(expiresAt) {
        const countdownElement = document.getElementById('payment-countdown');
        const expirationTime = new Date(expiresAt).getTime();

        this.countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = expirationTime - now;

            if (distance < 0) {
                clearInterval(this.countdownInterval);
                countdownElement.textContent = 'EXPIRED';
                this.showError('Payment challenge expired. Please try again.');
                return;
            }

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    /**
     * Show transaction input step
     */
    showTransactionInput() {
        this.switchStep('payment-step-verify');
    }

    /**
     * Simulate payment for demo purposes
     */
    simulatePayment() {
        // Generate a mock transaction hash
        const mockTxHash = '0x' + Array.from({length: 64}, () =>
            Math.floor(Math.random() * 16).toString(16)
        ).join('');

        document.getElementById('transaction-hash-input').value = mockTxHash;

        // Automatically verify after short delay
        setTimeout(() => {
            this.verifyPayment();
        }, 500);
    }

    /**
     * Verify payment transaction
     */
    async verifyPayment() {
        const txHashInput = document.getElementById('transaction-hash-input');
        const txHash = txHashInput.value.trim();

        if (!txHash) {
            this.showError('Please enter a transaction hash');
            return;
        }

        try {
            // Show verification in progress
            this.showVerificationStatus('verifying', 'Verifying transaction on blockchain...');

            const response = await fetch(`${this.apiUrl}/api/payment/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    payment_id: this.currentPayment.payment_id,
                    transaction_hash: txHash,
                    network: this.currentPayment.network
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showVerificationStatus('success', 'Transaction verified successfully!');

                // Wait a moment before showing success screen
                setTimeout(() => {
                    this.displayPaymentSuccess(result);
                }, 1500);
            } else {
                this.showVerificationStatus('error', result.error || 'Verification failed');
            }

        } catch (error) {
            console.error('Payment verification error:', error);
            this.showVerificationStatus('error', 'Failed to verify payment. Please try again.');
        }
    }

    /**
     * Display payment success
     */
    displayPaymentSuccess(result) {
        // Update receipt details
        document.getElementById('receipt-payment-id').textContent = result.payment_id;
        document.getElementById('receipt-tx-hash').textContent = result.transaction_hash.substring(0, 20) + '...';
        document.getElementById('receipt-amount').textContent = `$${result.net_amount.toFixed(2)} ${this.currentPayment.currency}`;
        document.getElementById('receipt-network').textContent = result.blockchain.network.toUpperCase();

        // Update explorer link
        if (result.blockchain.explorer_url) {
            document.getElementById('receipt-explorer-link').href = result.blockchain.explorer_url;
        }

        this.switchStep('payment-step-success');
    }

    /**
     * Complete payment and close modal
     */
    completePayment() {
        this.closePaymentModal();

        // Call success callback if provided
        if (this.onPaymentSuccess) {
            this.onPaymentSuccess(this.currentPayment);
        }

        // Reset
        this.currentPayment = null;
        this.onPaymentSuccess = null;
    }

    /**
     * Copy payment address to clipboard
     */
    copyAddress() {
        const address = document.getElementById('payment-address').textContent;
        navigator.clipboard.writeText(address).then(() => {
            // Show copied notification
            const btn = document.querySelector('.btn-copy');
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    }

    /**
     * Show verification status
     */
    showVerificationStatus(status, message) {
        const statusElement = document.getElementById('verification-status');
        const iconElement = statusElement.querySelector('.status-icon');
        const messageElement = statusElement.querySelector('.status-message');

        statusElement.classList.remove('hidden', 'success', 'error', 'verifying');
        statusElement.classList.add(status);

        const icons = {
            verifying: '<i class="fas fa-spinner fa-spin"></i>',
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>'
        };

        iconElement.innerHTML = icons[status] || '';
        messageElement.textContent = message;
    }

    /**
     * Switch payment step
     */
    switchStep(stepId) {
        document.querySelectorAll('.payment-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(stepId).classList.add('active');
    }

    /**
     * Open payment modal
     */
    openPaymentModal() {
        this.paymentModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close payment modal
     */
    closePaymentModal() {
        this.paymentModal.classList.add('hidden');
        document.body.style.overflow = '';

        // Clear countdown interval
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        // Reset to first step
        this.switchStep('payment-step-challenge');
    }

    /**
     * Show error message
     */
    showError(message) {
        alert(message); // Replace with better error UI in production
    }
}

// Initialize global payment module
const paymentModule = new PaymentModule();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentModule;
}
