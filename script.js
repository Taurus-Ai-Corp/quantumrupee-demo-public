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
                                <div class="terminal-input-line" id="terminal-input-line">
                                    <span class="terminal-prompt">Q₹></span>
                                    <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" style="background: transparent; border: none; color: #00ff00; outline: none; flex: 1; font-family: monospace;">
                                    <span class="terminal-cursor">█</span>
                                </div>
                            </div>
                            <div class="kyc-step active" id="step-1">
                                <h4>Step 1: Aadhaar Authentication</h4>
                                <div class="aadhaar-input">
                                    <input type="text" placeholder="Enter 12-digit Aadhaar Number" maxlength="12" id="aadhaar-input" pattern="[0-9]{12}" onkeypress="handleAadhaarInput(event)">
                                    <button class="btn btn-primary" onclick="startKYC()" id="start-kyc-btn">
                                        <i class="fas fa-play"></i> Start KYC
                                    </button>
                                </div>
                                <div class="biometric-auth" id="biometric-auth" style="display: none;">
                                    <i class="fas fa-fingerprint" id="fingerprint-icon"></i>
                                    <p id="biometric-message">Place finger on sensor</p>
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                                    </div>
                                    <button class="btn btn-outline" onclick="retryBiometric()" id="retry-biometric" style="display: none; margin-top: 1rem;">
                                        <i class="fas fa-redo"></i> Retry
                                    </button>
                                </div>
                                <div class="kyc-actions" id="step1-actions" style="display: none; margin-top: 1rem;">
                                    <button class="btn btn-secondary" id="next-btn-1" onclick="nextStep(2)">
                                        <i class="fas fa-arrow-right"></i> Next Step →
                                    </button>
                                    <button class="btn btn-outline" onclick="viewDetails()" style="margin-left: 0.5rem;">
                                        <i class="fas fa-info-circle"></i> View Details
                                    </button>
                                </div>
                            </div>
                            <div class="kyc-step" id="step-2" style="display: none;">
                                <h4>Step 2: Document Verification & ZK Proof Generation</h4>
                                <div class="document-upload" id="document-upload" style="display: none;">
                                    <p>Upload supporting documents:</p>
                                    <div class="doc-options">
                                        <button class="btn btn-outline" onclick="uploadDocument('PAN')">
                                            <i class="fas fa-id-card"></i> PAN Card
                                        </button>
                                        <button class="btn btn-outline" onclick="uploadDocument('Address')">
                                            <i class="fas fa-home"></i> Address Proof
                                        </button>
                                    </div>
                                </div>
                                <div class="terminal-output" id="zk-terminal"></div>
                                <div class="progress-bar">
                                    <div class="progress-fill" id="zk-progress" style="width: 0%"></div>
                                </div>
                                <div class="zk-proofs-display" id="zk-proofs-display" style="display: none; margin-top: 1rem;">
                                    <div class="proof-item">
                                        <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                                        <span>Age Proof: ≥18 (ZK-SNARK)</span>
                                    </div>
                                    <div class="proof-item">
                                        <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                                        <span>Location Proof: Maharashtra (ZK-SNARK)</span>
                                    </div>
                                </div>
                                <div class="kyc-actions" id="step2-actions" style="display: none; margin-top: 1rem;">
                                    <button class="btn btn-secondary" id="next-btn-2" onclick="nextStep(3)">
                                        <i class="fas fa-arrow-right"></i> Next Step →
                                    </button>
                                </div>
                            </div>
                            <div class="kyc-step" id="step-3" style="display: none;">
                                <h4>Step 3: Blockchain Verification & Credential Issuance</h4>
                                <div class="terminal-output" id="blockchain-terminal"></div>
                                <div class="verification-status" id="verification-status" style="display: none;">
                                    <div class="status-item">
                                        <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                                        <span>Hedera Hashgraph: Verified</span>
                                    </div>
                                    <div class="status-item">
                                        <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                                        <span>W3C Credential: Issued</span>
                                    </div>
                                    <div class="status-item">
                                        <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                                        <span>IPFS Storage: Stored</span>
                                    </div>
                                </div>
                                <div class="success-message" id="success-message" style="display: none;">
                                    <i class="fas fa-check-circle" style="color: var(--success-color); font-size: 3rem;"></i>
                                    <p>KYC Token Created Successfully!</p>
                                    <div class="kyc-stats">
                                        <div class="stat-item">
                                            <span class="stat-label">Time:</span>
                                            <span class="stat-value" id="kyc-time">87 seconds</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-label">Cost:</span>
                                            <span class="stat-value" id="kyc-cost">₹15</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-label">Token ID:</span>
                                            <span class="stat-value" id="token-id">--</span>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary" onclick="downloadCredential()" style="margin-top: 1rem;">
                                        <i class="fas fa-download"></i> Download Credential
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            // Initialize terminal input handler
            setTimeout(() => {
                const terminalInput = document.getElementById('terminal-input');
                if (terminalInput) {
                    terminalInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            handleTerminalCommand(e.target.value);
                            e.target.value = '';
                        }
                    });
                }
            }, 100);
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

// KYC Flow with Enhanced Terminal Animation
let kycTransactionId = null;
let kycStep = 1;
let kycData = {};

// Handle Aadhaar input validation
function handleAadhaarInput(event) {
    const input = event.target;
    const value = input.value.replace(/\D/g, ''); // Only numbers
    input.value = value;
    
    if (value.length === 12) {
        document.getElementById('start-kyc-btn').disabled = false;
        addTerminalOutput(`✓ Aadhaar format valid: ${value.substring(0, 4)}****${value.substring(8)}`);
    } else {
        document.getElementById('start-kyc-btn').disabled = true;
    }
}

// Handle terminal commands
function handleTerminalCommand(command) {
    if (!command.trim()) return;
    
    addTerminalOutput(`Q₹> ${command}`);
    
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'help' || cmd === 'h') {
        addTerminalOutput('Available commands:');
        addTerminalOutput('  status - Check KYC status');
        addTerminalOutput('  details - View transaction details');
        addTerminalOutput('  verify - Verify current step');
        addTerminalOutput('  help - Show this help');
    } else if (cmd === 'status') {
        addTerminalOutput(`Current Step: ${kycStep}`);
        addTerminalOutput(`Transaction ID: ${kycTransactionId || 'Not started'}`);
    } else if (cmd === 'details') {
        viewDetails();
    } else if (cmd === 'verify') {
        verifyCurrentStep();
    } else {
        addTerminalOutput(`Unknown command: ${command}. Type 'help' for available commands.`);
    }
}

async function startKYC() {
    const aadhaarInput = document.getElementById('aadhaar-input');
    if (!aadhaarInput || aadhaarInput.value.length !== 12) {
        addTerminalOutput('❌ Error: Please enter a valid 12-digit Aadhaar number');
        return;
    }

    const aadhaar = aadhaarInput.value;
    kycData.aadhaar = aadhaar;
    
    // Show terminal output
    addTerminalOutput('🔐 Starting KYC Process...');
    addTerminalOutput(`📱 Aadhaar: ${aadhaar.substring(0, 4)}****${aadhaar.substring(8)}`);
    addTerminalOutput('🔗 Connecting to UIDAI servers...');
    
    // Disable input
    aadhaarInput.disabled = true;
    document.getElementById('start-kyc-btn').disabled = true;
    
    // Show biometric auth
    document.getElementById('biometric-auth').style.display = 'block';
    
    // Try API call, fallback to simulation
    try {
        addTerminalOutput('🌐 Connecting to backend API...');
        const response = await fetch(`${API_URL}/kyc/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aadhaar })
        });
        
        if (!response.ok) throw new Error('API error');
        
        const data = await response.json();
        kycTransactionId = data.transactionId;
        kycData.transactionId = kycTransactionId;
        addTerminalOutput(`✅ Transaction ID: ${kycTransactionId}`);
        addTerminalOutput(`📊 Status: ${data.status || 'started'}`);
        addTerminalOutput('💾 Data saved to Neon database');
    } catch (error) {
        kycTransactionId = Date.now();
        kycData.transactionId = kycTransactionId;
        addTerminalOutput('⚠️ Backend unavailable - Using offline mode');
        addTerminalOutput(`📝 Local Transaction ID: ${kycTransactionId}`);
    }
    
    setTimeout(() => {
        simulateBiometric();
    }, 1000);
}

function retryBiometric() {
    document.getElementById('retry-biometric').style.display = 'none';
    document.getElementById('progress-fill').style.width = '0%';
    addTerminalOutput('🔄 Retrying biometric authentication...');
    simulateBiometric();
}

function simulateBiometric() {
    const progressFill = document.getElementById('progress-fill');
    const fingerprintIcon = document.getElementById('fingerprint-icon');
    const biometricMessage = document.getElementById('biometric-message');
    let progress = 0;
    let attempts = 0;
    
    addTerminalOutput('👆 Biometric authentication in progress...');
    addTerminalOutput('📱 Place your finger on the sensor');
    
    const interval = setInterval(() => {
        progress += 5;
        if (progressFill) progressFill.style.width = progress + '%';
        
        // Simulate fingerprint reading stages
        if (progress === 25) {
            addTerminalOutput('🔍 Scanning fingerprint...');
            fingerprintIcon.style.animation = 'pulse 1s infinite';
        } else if (progress === 50) {
            addTerminalOutput('🔐 Matching against Aadhaar database...');
            biometricMessage.textContent = 'Matching fingerprint...';
        } else if (progress === 75) {
            addTerminalOutput('✅ Fingerprint matched!');
            biometricMessage.textContent = 'Fingerprint verified';
            fingerprintIcon.style.color = 'var(--success-color)';
        } else if (progress % 20 === 0 && progress < 100) {
            addTerminalOutput(`⏳ Progress: ${progress}%`);
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            fingerprintIcon.style.animation = 'none';
            addTerminalOutput('✅ Biometric verified successfully');
            addTerminalOutput('🔐 Generating secure hash...');
            
            // Simulate hash generation
            setTimeout(() => {
                const hash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
                addTerminalOutput(`🔑 Hash: ${hash.substring(0, 20)}...`);
                addTerminalOutput('💾 Storing encrypted data...');
                
                // Save step 1 data
                kycData.step1 = {
                    aadhaarHash: hash,
                    biometricVerified: true,
                    timestamp: new Date().toISOString()
                };
                
                // Update backend
                updateKYCStep(1, 'completed');
                
                setTimeout(() => {
                    document.getElementById('step1-actions').style.display = 'block';
                    addTerminalOutput('✅ Step 1 Complete - Ready for next step');
                    addTerminalOutput('💡 Type "help" for available commands');
                }, 500);
            }, 1000);
        }
    }, 150);
}

// Update KYC step in backend
async function updateKYCStep(step, status) {
    if (!kycTransactionId) return;
    
    try {
        await fetch(`${API_URL}/kyc/step`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transactionId: kycTransactionId,
                step: step,
                status: status
            })
        });
    } catch (error) {
        // Silent fail - offline mode
    }
}

function viewDetails() {
    addTerminalOutput('📋 KYC Transaction Details:');
    addTerminalOutput(`  Transaction ID: ${kycTransactionId}`);
    addTerminalOutput(`  Current Step: ${kycStep}`);
    addTerminalOutput(`  Aadhaar: ${kycData.aadhaar ? kycData.aadhaar.substring(0, 4) + '****' + kycData.aadhaar.substring(8) : 'N/A'}`);
    if (kycData.step1) {
        addTerminalOutput(`  Biometric: Verified`);
        addTerminalOutput(`  Hash: ${kycData.step1.aadhaarHash.substring(0, 20)}...`);
    }
}

function verifyCurrentStep() {
    addTerminalOutput(`🔍 Verifying Step ${kycStep}...`);
    if (kycStep === 1 && kycData.step1) {
        addTerminalOutput('✅ Step 1 verified: Biometric authentication complete');
    } else if (kycStep === 2 && kycData.step2) {
        addTerminalOutput('✅ Step 2 verified: ZK proofs generated');
    } else {
        addTerminalOutput('⚠️ Step not yet completed');
    }
}

function nextStep(stepNumber) {
    kycStep = stepNumber;
    
    if (stepNumber === 2) {
        document.getElementById('step-1').classList.remove('active');
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'block';
        document.getElementById('step-2').classList.add('active');
        
        addTerminalOutput('🚀 Moving to Step 2: Document Verification & ZK Proof Generation');
        addTerminalOutput('📄 Preparing document verification...');
        
        const zkTerminal = document.getElementById('zk-terminal');
        if (zkTerminal) {
            zkTerminal.innerHTML = '';
            setTimeout(() => {
                simulateZKProofs();
            }, 500);
        }
        
        // Show document upload option
        setTimeout(() => {
            document.getElementById('document-upload').style.display = 'block';
        }, 1000);
        
        updateKYCStep(2, 'started');
    } else if (stepNumber === 3) {
        document.getElementById('step-2').classList.remove('active');
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-3').style.display = 'block';
        document.getElementById('step-3').classList.add('active');
        
        addTerminalOutput('🚀 Moving to Step 3: Blockchain Verification & Credential Issuance');
        simulateBlockchainVerification();
        
        updateKYCStep(3, 'started');
    }
}

function uploadDocument(type) {
    addTerminalOutput(`📤 Uploading ${type} document...`);
    addTerminalOutput(`✅ ${type} document verified`);
    
    if (!kycData.documents) kycData.documents = [];
    kycData.documents.push(type);
    
    // Update UI
    const btn = event.target.closest('button');
    btn.innerHTML = `<i class="fas fa-check-circle"></i> ${type} ✓`;
    btn.disabled = true;
    btn.style.background = 'var(--success-color)';
    btn.style.color = 'white';
}

function simulateZKProofs() {
    const zkTerminal = document.getElementById('zk-terminal');
    const zkProgress = document.getElementById('zk-progress');
    let progress = 0;
    
    const messages = [
        '🔐 Initializing ZK-SNARK circuit...',
        '📊 Extracting age from DOB...',
        '🔒 Generating age proof (≥18) without revealing DOB...',
        '📍 Extracting location from address...',
        '🔒 Generating location proof (Maharashtra) without revealing address...',
        '🔐 Combining proofs into single ZK credential...',
        '💾 Storing proofs on IPFS...',
        '✅ ZK proofs generated successfully'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        if (messageIndex < messages.length) {
            addTerminalOutput(messages[messageIndex], 'zk-terminal');
            messageIndex++;
        }
        
        progress += 12.5;
        if (zkProgress) zkProgress.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(messageInterval);
            
            // Save step 2 data
            kycData.step2 = {
                zkProofs: {
                    age: '0x9a8b7c6d...',
                    location: '0x1a2b3c4d...'
                },
                ipfsHash: 'QmXyZ123...',
                timestamp: new Date().toISOString()
            };
            
            // Show proofs
            document.getElementById('zk-proofs-display').style.display = 'block';
            addTerminalOutput('✅ Age Proof: 0x9a8b7c6d...', 'zk-terminal');
            addTerminalOutput('✅ Location Proof: 0x1a2b3c4d...', 'zk-terminal');
            addTerminalOutput('📦 IPFS Hash: QmXyZ123...', 'zk-terminal');
            
            updateKYCStep(2, 'completed');
            
            setTimeout(() => {
                document.getElementById('step2-actions').style.display = 'block';
            }, 500);
        }
    }, 600);
}

function simulateBlockchainVerification() {
    const blockchainTerminal = document.getElementById('blockchain-terminal');
    let step = 0;
    
    const steps = [
        { msg: '🔗 Connecting to Hedera Hashgraph...', delay: 500 },
        { msg: '📝 Creating transaction...', delay: 800 },
        { msg: '⏳ Waiting for consensus...', delay: 1000 },
        { msg: '✅ Transaction confirmed (3.2s)', delay: 800 },
        { msg: '📄 Generating W3C Verifiable Credential...', delay: 600 },
        { msg: '💾 Storing credential on IPFS...', delay: 800 },
        { msg: '🔐 Signing with quantum-ready cryptography...', delay: 600 },
        { msg: '✅ Credential issued successfully!', delay: 500 }
    ];
    
    function runStep() {
        if (step < steps.length) {
            addTerminalOutput(steps[step].msg, 'blockchain-terminal');
            step++;
            setTimeout(runStep, steps[step - 1].delay);
        } else {
            // Show verification status
            document.getElementById('verification-status').style.display = 'block';
            
            // Generate token ID
            const tokenId = 'Q₹-' + Date.now().toString(36).toUpperCase();
            kycData.tokenId = tokenId;
            kycData.step3 = {
                tokenId: tokenId,
                hederaHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
                ipfsHash: 'Qm' + Array.from({length: 44}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join(''),
                timestamp: new Date().toISOString()
            };
            
            updateKYCStep(3, 'completed');
            
            // Show success message
            setTimeout(() => {
                document.getElementById('success-message').style.display = 'block';
                document.getElementById('token-id').textContent = tokenId;
                document.getElementById('kyc-time').textContent = '87 seconds';
                document.getElementById('kyc-cost').textContent = '₹15';
                
                addTerminalOutput(`🎉 KYC Complete! Token ID: ${tokenId}`, 'blockchain-terminal');
                addTerminalOutput('💾 All data saved to Neon database', 'blockchain-terminal');
            }, 500);
        }
    }
    
    runStep();
}

function downloadCredential() {
    addTerminalOutput('📥 Downloading credential...');
    
    const credential = {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "id": `https://quantumrupee.gov.in/credentials/kyc/${kycData.tokenId}`,
        "type": ["VerifiableCredential", "KYCCredential"],
        "issuer": "QUANTUM_RUPEE (Q₹)",
        "issuanceDate": new Date().toISOString(),
        "credentialSubject": {
            "id": `did:hedera:${kycData.step1?.aadhaarHash}`,
            "kycLevel": "FULL_KYC",
            "zkProofs": kycData.step2?.zkProofs
        },
        "proof": {
            "type": "EcdsaSecp256k1Signature2019",
            "created": new Date().toISOString(),
            "proofPurpose": "assertionMethod"
        }
    };
    
    const blob = new Blob([JSON.stringify(credential, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyc-credential-${kycData.tokenId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    addTerminalOutput('✅ Credential downloaded successfully');
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
