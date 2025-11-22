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
            // Update active nav link
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

// Demo Selector Handlers
document.querySelectorAll('.demo-select-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.demo-select-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const demoType = this.getAttribute('data-demo');
        loadLiveDemo(demoType);
    });
});

// Load Demo Content
function loadDemo(type) {
    const demoContent = document.getElementById('demo-content');
    
    switch(type) {
        case 'kyc-flow':
            demoContent.innerHTML = `
                <div class="demo-screen">
                    <div class="phone-mockup">
                        <div class="phone-header">
                            <span>QUANTUM_RUPEE (Q₹) - KYC Flow</span>
                        </div>
                        <div class="phone-content">
                            <div class="kyc-step active" id="step-1">
                                <h4>Step 1: Aadhaar Authentication</h4>
                                <div class="aadhaar-input">
                                    <input type="text" placeholder="Enter Aadhaar Number" maxlength="12" id="aadhaar-input">
                                    <button class="btn btn-primary" onclick="startKYC()">Scan QR</button>
                                </div>
                                <div class="biometric-auth" id="biometric-auth" style="display: none;">
                                    <i class="fas fa-fingerprint"></i>
                                    <p>Place finger on sensor</p>
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="kyc-step" id="step-2" style="display: none;">
                                <h4>Step 2: ZK Proof Generation</h4>
                                <p>Generating zero-knowledge proofs...</p>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 60%"></div>
                                </div>
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

// Load Live Demo
function loadLiveDemo(type) {
    const liveDemoContent = document.getElementById('live-demo-content');
    
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
                            <button class="btn btn-primary" onclick="simulateTransaction()">
                                <i class="fas fa-paper-plane"></i> Send
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
                            <div class="qr-code">QR CODE</div>
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

// KYC Flow Simulation
let userBalance = 5000;
let receivedAmount = 0;

function startKYC() {
    const aadhaarInput = document.getElementById('aadhaar-input');
    if (aadhaarInput && aadhaarInput.value.length === 12) {
        document.getElementById('biometric-auth').style.display = 'block';
        simulateBiometric();
    } else {
        alert('Please enter a valid 12-digit Aadhaar number');
    }
}

function simulateBiometric() {
    const progressFill = document.getElementById('progress-fill');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('step-1').style.display = 'none';
                document.getElementById('step-2').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('step-2').style.display = 'none';
                    document.getElementById('step-3').style.display = 'block';
                }, 2000);
            }, 500);
        }
    }, 200);
}

// Transaction Simulation
function simulateTransaction() {
    const amountInput = document.getElementById('tx-amount');
    const amount = parseInt(amountInput.value);
    
    if (!amount || amount <= 0 || amount > userBalance) {
        alert('Invalid amount');
        return;
    }
    
    userBalance -= amount;
    receivedAmount += amount;
    
    document.getElementById('user-balance').textContent = `₹${userBalance.toLocaleString()}`;
    document.getElementById('received-amount').textContent = `₹${receivedAmount.toLocaleString()}`;
    
    // Add to transaction history
    const txList = document.getElementById('tx-list');
    const txItem = document.createElement('div');
    txItem.className = 'tx-item';
    txItem.innerHTML = `
        <span>Sent ₹${amount}</span>
        <span style="color: var(--success-color);">✓ Offline</span>
    `;
    txList.insertBefore(txItem, txList.firstChild);
    
    // Add to merchant history
    const merchantTxList = document.getElementById('merchant-tx-list');
    const merchantTxItem = document.createElement('div');
    merchantTxItem.className = 'tx-item';
    merchantTxItem.innerHTML = `
        <span>Received ₹${amount}</span>
        <span style="color: var(--success-color);">✓ Offline</span>
    `;
    merchantTxList.insertBefore(merchantTxItem, merchantTxList.firstChild);
    
    amountInput.value = '';
}

// Fraud Detection Analysis
function analyzeFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Simulate analysis
    document.getElementById('upload-area').style.display = 'none';
    document.getElementById('analysis-results').style.display = 'block';
    
    // Simulate scores (in real app, these would come from AI model)
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
    // Load default demo
    loadDemo('kyc-flow');
    loadLiveDemo('kyc');
});

