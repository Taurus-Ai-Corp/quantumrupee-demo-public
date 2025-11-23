/**
 * Copyright (c) 2025 TAURUS AI Corp
 * QUANTUM_RUPEE (Q₹) - Enhanced Demo Script
 * Backend API Integration with Neon Database
 */

// API Configuration
const API_BASE_URL = process.env.API_URL || 'https://quantumrupee-api.herokuapp.com/api';
const LOCAL_API_URL = 'http://localhost:3000/api';

// Use local API if available, otherwise use production
let API_URL = LOCAL_API_URL;
fetch(LOCAL_API_URL + '/health').catch(() => {
    API_URL = API_BASE_URL;
});

// Navigation Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Demo Button Handlers
document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.demo-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const demoType = this.getAttribute('data-demo');
        loadDemo(demoType);
    });
});

// Demo Selector Handlers (Live Demo Section)
document.querySelectorAll('.demo-select-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.demo-select-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const demoType = this.getAttribute('data-demo');
        loadLiveDemo(demoType);
    });
});

// Load Demo Content (Interactive KYC Demo)
function loadDemo(type) {
    const demoContent = document.getElementById('demo-content');
    if (!demoContent) return;
    
    switch(type) {
        case 'kyc-flow':
            demoContent.innerHTML = `
                <div class="demo-screen">
                    <div class="phone-mockup">
                        <div class="phone-header">
                            <span>QUANTUM_RUPEE (Q₹) - KYC Flow</span>
                        </div>
                        <div class="phone-content">
                            <div class="terminal-container" id="terminal-container">
                                <div class="terminal-output" id="terminal-output"></div>
                                <div class="terminal-input-line">
                                    <span class="terminal-prompt">Q₹></span>
                                    <span class="terminal-cursor">█</span>
                                </div>
                            </div>
                            <div class="kyc-step active" id="step-1">
                                <h4>Step 1: Aadhaar Authentication</h4>
                                <div class="aadhaar-input">
                                    <input type="text" placeholder="Enter Aadhaar Number" maxlength="12" id="aadhaar-input" pattern="[0-9]{12}">
                                    <button class="btn btn-primary" onclick="startKYC()">Start KYC</button>
                                </div>
                                <div class="biometric-auth" id="biometric-auth" style="display: none;">
                                    <i class="fas fa-fingerprint"></i>
                                    <p>Place finger on sensor</p>
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                                    </div>
                                </div>
                                <button class="btn btn-secondary" id="next-btn-1" onclick="nextStep(2)" style="display: none; margin-top: 1rem;">
                                    Next Step →
                                </button>
                            </div>
                            <div class="kyc-step" id="step-2" style="display: none;">
                                <h4>Step 2: ZK Proof Generation</h4>
                                <div class="terminal-output" id="zk-terminal"></div>
                                <div class="progress-bar">
                                    <div class="progress-fill" id="zk-progress" style="width: 0%"></div>
                                </div>
                                <button class="btn btn-secondary" id="next-btn-2" onclick="nextStep(3)" style="display: none; margin-top: 1rem;">
                                    Next Step →
                                </button>
                            </div>
                            <div class="kyc-step" id="step-3" style="display: none;">
                                <h4>Step 3: Credential Issued</h4>
                                <div class="success-message">
                                    <i class="fas fa-check-circle" style="color: var(--success-color); font-size: 3rem;"></i>
                                    <p>KYC Token Created Successfully!</p>
                                    <p style="font-size: 0.9rem; color: var(--gray);">Time: 87 seconds | Cost: ₹15</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'zk-proofs':
            demoContent.innerHTML = `
                <div class="demo-screen">
                    <h4>Zero-Knowledge Proofs Demo</h4>
                    <div class="zk-demo">
                        <div class="zk-item">
                            <h5>Age Verification</h5>
                            <p>Prove: Age ≥ 18</p>
                            <p style="color: var(--success-color);">✓ Proof Generated (without revealing DOB)</p>
                        </div>
                        <div class="zk-item">
                            <h5>Location Verification</h5>
                            <p>Prove: Resident of Maharashtra</p>
                            <p style="color: var(--success-color);">✓ Proof Generated (without revealing address)</p>
                        </div>
                        <div class="zk-item">
                            <h5>Privacy Gain</h5>
                            <p style="font-size: 2rem; color: var(--primary-color); font-weight: 700;">95%</p>
                            <p>Data exposure reduction</p>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'verification':
            demoContent.innerHTML = `
                <div class="demo-screen">
                    <h4>Instant Verification Demo</h4>
                    <div class="verification-demo">
                        <div class="verification-step">
                            <h5>1. Consent Request</h5>
                            <p>Bank requests KYC verification</p>
                        </div>
                        <div class="verification-step">
                            <h5>2. Selective Disclosure</h5>
                            <p>User grants consent with ZK proofs</p>
                        </div>
                        <div class="verification-step">
                            <h5>3. Verification</h5>
                            <p>Blockchain check completed</p>
                        </div>
                        <div class="verification-step">
                            <h5>4. Onboarding</h5>
                            <p style="color: var(--success-color);">✓ User onboarded in 8-10 seconds</p>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
}

// Load Live Demo (Main Demo Section)
function loadLiveDemo(type) {
    const liveDemoContent = document.getElementById('live-demo-content');
    if (!liveDemoContent) return;
    
    switch(type) {
        case 'kyc':
            loadDemo('kyc-flow');
            break;
        case 'offline':
            liveDemoContent.innerHTML = `
                <div class="transaction-simulator">
                    <div class="user-device">
                        <h4>User Device</h4>
                        <div class="balance-display">
                            <span class="balance-label">Balance:</span>
                            <span class="balance-amount" id="user-balance">₹5,000</span>
                        </div>
                        <div class="transaction-form">
                            <input type="number" id="tx-amount" placeholder="Amount" min="1" max="5000">
                            <button class="btn btn-primary" onclick="processOfflinePayment()">
                                <i class="fas fa-paper-plane"></i> Pay
                            </button>
                        </div>
                        <div class="transaction-history">
                            <h5>Transaction History</h5>
                            <div class="tx-list" id="tx-list"></div>
                        </div>
                    </div>
                    <div class="merchant-device">
                        <h4>Merchant Device</h4>
                        <div class="qr-display">
                            <div id="qr-code-container">
                                <img id="qr-code-image" src="" alt="QR Code" style="display: none; max-width: 200px; height: auto;">
                                <div id="qr-placeholder" class="qr-code">Generate QR Code</div>
                            </div>
                            <button class="btn btn-primary" onclick="generateQRCode()" style="margin-top: 1rem;">
                                <i class="fas fa-qrcode"></i> Generate QR
                            </button>
                            <p>Scan to pay</p>
                        </div>
                        <div class="received-amount">
                            <span class="amount-label">Received:</span>
                            <span class="amount-value" id="received-amount">₹0</span>
                        </div>
                        <div class="transaction-history">
                            <h5>Received Transactions</h5>
                            <div class="tx-list" id="merchant-tx-list"></div>
                        </div>
                    </div>
                </div>
            `;
            // Generate initial QR code
            setTimeout(() => generateQRCode(), 500);
            break;
        case 'fraud':
            liveDemoContent.innerHTML = `
                <div class="fraud-detection-demo">
                    <div class="upload-area" id="upload-area" onclick="document.getElementById('file-input').click()">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Upload video/image for analysis</p>
                        <input type="file" id="file-input" accept="image/*,video/*" style="display: none;" onchange="analyzeFile(event)">
                    </div>
                    <div class="analysis-results" id="analysis-results" style="display: none;">
                        <h4>Analysis Results</h4>
                        <div class="result-item">
                            <span class="result-label">Deepfake Score:</span>
                            <span class="result-value" id="deepfake-score">--</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Voice Synthesis:</span>
                            <span class="result-value" id="voice-score">--</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Behavioral Anomaly:</span>
                            <span class="result-value" id="behavioral-score">--</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Overall Risk:</span>
                            <span class="result-value" id="overall-risk">--</span>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
}

// Terminal-like output for KYC
function addTerminalOutput(text, containerId = 'terminal-output') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
}

// KYC Flow with Terminal Animation
let kycTransactionId = null;

async function startKYC() {
    const aadhaarInput = document.getElementById('aadhaar-input');
    if (!aadhaarInput || aadhaarInput.value.length !== 12) {
        alert('Please enter a valid 12-digit Aadhaar number');
        return;
    }

    const aadhaar = aadhaarInput.value;
    
    // Show terminal output
    addTerminalOutput('🔐 Starting KYC Process...');
    addTerminalOutput(`📱 Aadhaar: ${aadhaar.substring(0, 4)}****${aadhaar.substring(8)}`);
    
    // Show biometric auth
    document.getElementById('biometric-auth').style.display = 'block';
    
    // Try API call, fallback to simulation
    try {
        const response = await fetch(`${API_URL}/kyc/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aadhaar })
        });
        const data = await response.json();
        kycTransactionId = data.transactionId;
        addTerminalOutput(`✅ Transaction ID: ${kycTransactionId}`);
    } catch (error) {
        kycTransactionId = Date.now();
        addTerminalOutput('⚠️ Using offline mode');
    }
    
    simulateBiometric();
}

function simulateBiometric() {
    const progressFill = document.getElementById('progress-fill');
    let progress = 0;
    
    addTerminalOutput('👆 Biometric authentication in progress...');
    
    const interval = setInterval(() => {
        progress += 10;
        if (progressFill) progressFill.style.width = progress + '%';
        
        if (progress % 30 === 0) {
            addTerminalOutput(`⏳ Progress: ${progress}%`);
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            addTerminalOutput('✅ Biometric verified');
            addTerminalOutput('🔐 Generating secure hash...');
            
            setTimeout(() => {
                document.getElementById('next-btn-1').style.display = 'block';
                addTerminalOutput('✅ Step 1 Complete - Ready for next step');
            }, 500);
        }
    }, 200);
}

function nextStep(stepNumber) {
    if (stepNumber === 2) {
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'block';
        
        const zkTerminal = document.getElementById('zk-terminal');
        if (zkTerminal) {
            zkTerminal.innerHTML = '';
            simulateZKProofs();
        }
    } else if (stepNumber === 3) {
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-3').style.display = 'block';
    }
}

function simulateZKProofs() {
    const zkTerminal = document.getElementById('zk-terminal');
    const zkProgress = document.getElementById('zk-progress');
    let progress = 0;
    
    const messages = [
        '🔐 Initializing ZK-SNARK circuit...',
        '📊 Generating age proof (≥18)...',
        '📍 Generating location proof (Maharashtra)...',
        '🔒 Encrypting sensitive data...',
        '✅ ZK proofs generated successfully'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        if (messageIndex < messages.length) {
            addTerminalOutput(messages[messageIndex], 'zk-terminal');
            messageIndex++;
        }
        
        progress += 20;
        if (zkProgress) zkProgress.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(messageInterval);
            document.getElementById('next-btn-2').style.display = 'block';
        }
    }, 800);
}

// Offline CBDC Functions
let currentQRData = null;
let userBalance = 5000;
let receivedAmount = 0;

async function generateQRCode() {
    const amount = prompt('Enter amount for QR code:', '100');
    if (!amount || amount <= 0) return;
    
    const merchantId = 'merchant_' + Date.now();
    
    try {
        const response = await fetch(`${API_URL}/cbdc/generate-qr`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ merchantId, amount: parseFloat(amount) })
        });
        
        const data = await response.json();
        currentQRData = data.qrData;
        
        // Display QR code
        const qrImage = document.getElementById('qr-code-image');
        const qrPlaceholder = document.getElementById('qr-placeholder');
        
        if (qrImage && data.qrCode) {
            qrImage.src = data.qrCode;
            qrImage.style.display = 'block';
            if (qrPlaceholder) qrPlaceholder.style.display = 'none';
        }
    } catch (error) {
        // Fallback: Generate QR code client-side
        generateQRCodeClientSide(merchantId, amount);
    }
}

function generateQRCodeClientSide(merchantId, amount) {
    // Simple QR code generation using qrcode.js library
    const qrData = JSON.stringify({
        merchantId,
        amount: parseFloat(amount),
        timestamp: Date.now(),
        type: 'offline_cbdc'
    });
    
    currentQRData = qrData;
    
    // Use QRCode.js if available, otherwise show text
    if (typeof QRCode !== 'undefined') {
        const qrContainer = document.getElementById('qr-code-container');
        qrContainer.innerHTML = '';
        QRCode.toCanvas(qrContainer, qrData, { width: 200 }, (error) => {
            if (error) {
                qrContainer.innerHTML = `<div class="qr-code">QR: ${qrData.substring(0, 50)}...</div>`;
            }
        });
    } else {
        // Load QRCode library
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
        script.onload = () => generateQRCodeClientSide(merchantId, amount);
        document.head.appendChild(script);
    }
}

async function processOfflinePayment() {
    const amountInput = document.getElementById('tx-amount');
    const amount = parseFloat(amountInput.value);
    
    if (!amount || amount <= 0 || amount > userBalance) {
        alert('Invalid amount');
        return;
    }
    
    if (!currentQRData) {
        alert('Please generate QR code first');
        return;
    }
    
    try {
        const qrInfo = JSON.parse(currentQRData);
        
        const response = await fetch(`${API_URL}/cbdc/process-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transactionId: Date.now(),
                userId: 'user_demo',
                qrData: currentQRData
            })
        });
        
        const data = await response.json();
        
        // Update balances
        userBalance -= amount;
        receivedAmount += amount;
        
        document.getElementById('user-balance').textContent = `₹${userBalance.toLocaleString()}`;
        document.getElementById('received-amount').textContent = `₹${receivedAmount.toLocaleString()}`;
        
        // Add to transaction history
        addTransaction('tx-list', `Sent ₹${amount}`, '✓ Offline');
        addTransaction('merchant-tx-list', `Received ₹${amount}`, '✓ Offline');
        
        amountInput.value = '';
        
        // Show success animation
        showTransactionSuccess(amount);
    } catch (error) {
        // Fallback to local simulation
        userBalance -= amount;
        receivedAmount += amount;
        
        document.getElementById('user-balance').textContent = `₹${userBalance.toLocaleString()}`;
        document.getElementById('received-amount').textContent = `₹${receivedAmount.toLocaleString()}`;
        
        addTransaction('tx-list', `Sent ₹${amount}`, '✓ Offline');
        addTransaction('merchant-tx-list', `Received ₹${amount}`, '✓ Offline');
        
        amountInput.value = '';
        showTransactionSuccess(amount);
    }
}

function addTransaction(listId, text, status) {
    const txList = document.getElementById(listId);
    if (!txList) return;
    
    const txItem = document.createElement('div');
    txItem.className = 'tx-item';
    txItem.innerHTML = `
        <span>${text}</span>
        <span style="color: var(--success-color);">${status}</span>
    `;
    txList.insertBefore(txItem, txList.firstChild);
}

function showTransactionSuccess(amount) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Payment of ₹${amount} processed successfully!</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Fraud Detection Analysis
async function analyzeFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    document.getElementById('upload-area').style.display = 'none';
    document.getElementById('analysis-results').style.display = 'block';
    
    // Generate file hash
    const fileHash = await generateFileHash(file);
    
    try {
        const response = await fetch(`${API_URL}/fraud/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileHash })
        });
        
        const data = await response.json();
        
        document.getElementById('deepfake-score').textContent = data.deepfakeScore;
        document.getElementById('voice-score').textContent = data.voiceScore;
        document.getElementById('behavioral-score').textContent = data.behavioralScore;
        
        const riskLevel = data.overallRisk;
        const riskColor = riskLevel === 'Low Risk' ? 'var(--success-color)' : 
                         riskLevel === 'Medium Risk' ? 'var(--warning-color)' : 
                         'var(--danger-color)';
        
        document.getElementById('overall-risk').textContent = riskLevel;
        document.getElementById('overall-risk').style.color = riskColor;
    } catch (error) {
        // Fallback simulation
        setTimeout(() => {
            const deepfakeScore = (Math.random() * 20).toFixed(2) + '%';
            const voiceScore = (Math.random() * 15).toFixed(2) + '%';
            const behavioralScore = (Math.random() * 10).toFixed(2) + '%';
            
            document.getElementById('deepfake-score').textContent = deepfakeScore;
            document.getElementById('voice-score').textContent = voiceScore;
            document.getElementById('behavioral-score').textContent = behavioralScore;
            
            const overallRisk = parseFloat(deepfakeScore) + parseFloat(voiceScore) + parseFloat(behavioralScore);
            const riskLevel = overallRisk < 10 ? 'Low Risk' : overallRisk < 30 ? 'Medium Risk' : 'High Risk';
            const riskColor = overallRisk < 10 ? 'var(--success-color)' : overallRisk < 30 ? 'var(--warning-color)' : 'var(--danger-color)';
            
            document.getElementById('overall-risk').textContent = riskLevel;
            document.getElementById('overall-risk').style.color = riskColor;
        }, 2000);
    }
}

async function generateFileHash(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.ps-card, .solution-card, .flow-step').forEach(el => {
    observer.observe(el);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDemo('kyc-flow');
    loadLiveDemo('kyc');
    
    // Check API health
    fetch(`${API_URL}/health`)
        .then(res => res.json())
        .then(data => console.log('✅ API Connected:', data))
        .catch(() => console.log('⚠️ Using offline mode'));
});
