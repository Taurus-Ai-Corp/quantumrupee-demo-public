/**
 * QUANTUM_RUPEE (Q₹) - Retro-Futuristic Visual Effects
 * Copyright (c) 2025 TAURUS AI Corp
 * Animated particles, glitch effects, and interactive elements
 */

class RetroFuturisticEffects {
    constructor() {
        this.particlesContainer = null;
        this.particleCount = 50;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createParticles();
        this.addHoverEffects();
        this.addScrollAnimations();
        this.addGlitchEffect();
        this.addTypingEffect();
    }

    /**
     * Create floating particle background
     */
    createParticles() {
        // Create particles container
        this.particlesContainer = document.createElement('div');
        this.particlesContainer.className = 'particles';
        document.body.insertBefore(this.particlesContainer, document.body.firstChild);

        // Generate particles
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random positioning
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';

            // Random colors (cyan, magenta, green)
            const colors = ['#00f0ff', '#ff00f7', '#00ff41'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            this.particlesContainer.appendChild(particle);
        }
    }

    /**
     * Add interactive hover effects to cards
     */
    addHoverEffects() {
        const cards = document.querySelectorAll('.ps-card, .feature-card, .metric-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    /**
     * Add scroll-triggered animations
     */
    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        const elements = document.querySelectorAll('.ps-card, .feature-card, .solution-card, .demo-video');
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    /**
     * Add glitch text effect to hero title
     */
    addGlitchEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        setInterval(() => {
            if (Math.random() > 0.95) {
                heroTitle.style.textShadow = `
                    2px 2px 0 #00f0ff,
                    -2px -2px 0 #ff00f7,
                    0 0 20px rgba(0, 240, 255, 0.5)
                `;

                setTimeout(() => {
                    heroTitle.style.textShadow = '0 0 20px rgba(0, 240, 255, 0.5)';
                }, 100);
            }
        }, 2000);
    }

    /**
     * Add typing effect to subtitle
     */
    addTypingEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;

        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.opacity = '1';

        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                subtitle.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                // Add blinking cursor
                const cursor = document.createElement('span');
                cursor.textContent = '|';
                cursor.style.animation = 'blink 1s infinite';
                subtitle.appendChild(cursor);
            }
        }, 50);

        // Add blink animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add matrix rain effect (optional, can be enabled)
     */
    createMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0';
        canvas.style.opacity = '0.1';
        canvas.style.pointerEvents = 'none';
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'QUANTUMRUPEE01';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 33);

        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    /**
     * Add cyber scan line effect
     */
    addScanLine() {
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00f0ff, transparent);
            box-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
            z-index: 9999;
            pointer-events: none;
            animation: scan 4s linear infinite;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes scan {
                0% { top: 0; }
                100% { top: 100%; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(scanLine);
    }

    /**
     * Add data stream effect to metric cards
     */
    addDataStreamEffect() {
        const metricCards = document.querySelectorAll('.metric-card');

        metricCards.forEach(card => {
            const dataStream = document.createElement('div');
            dataStream.style.cssText = `
                position: absolute;
                top: 0;
                right: 10px;
                font-family: monospace;
                font-size: 8px;
                color: #00f0ff;
                opacity: 0.3;
                white-space: pre;
                line-height: 1.2;
            `;

            let data = '';
            for (let i = 0; i < 20; i++) {
                data += Math.random().toString(2).substr(2, 8) + '\n';
            }
            dataStream.textContent = data;
            card.appendChild(dataStream);

            // Animate data stream
            setInterval(() => {
                let newData = '';
                for (let i = 0; i < 20; i++) {
                    newData += Math.random().toString(2).substr(2, 8) + '\n';
                }
                dataStream.textContent = newData;
            }, 100);
        });
    }

    /**
     * Add holographic effect to badges
     */
    addHolographicEffect() {
        const badges = document.querySelectorAll('.badge, .badge-success');

        badges.forEach(badge => {
            badge.style.position = 'relative';
            badge.style.overflow = 'hidden';

            const shimmer = document.createElement('div');
            shimmer.style.cssText = `
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%);
                animation: shimmer 3s infinite;
            `;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes shimmer {
                    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                }
            `;
            document.head.appendChild(style);
            badge.appendChild(shimmer);
        });
    }
}

// Initialize effects when script loads
const retroEffects = new RetroFuturisticEffects();

// Optionally enable matrix rain (commented out by default for performance)
// retroEffects.createMatrixRain();

// Enable scan line effect
retroEffects.addScanLine();

// Enable data stream effect
retroEffects.addDataStreamEffect();

// Enable holographic effect
retroEffects.addHolographicEffect();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RetroFuturisticEffects;
}
