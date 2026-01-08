// Main Application

class WebMagicApp {
    constructor() {
        this.isLoaded = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeFeatures();
        this.handlePageLoad();
    }

    setupEventListeners() {
        // Page load events
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMReady();
        });

        window.addEventListener('load', () => {
            this.onPageLoad();
        });

        // Resize events
        window.addEventListener('resize', utils.debounce(() => {
            this.onResize();
        }, 250));

        // Scroll events
        window.addEventListener('scroll', utils.throttle(() => {
            this.onScroll();
        }, 16));

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.onKeyDown(e);
        });

        // Mouse events
        document.addEventListener('mousemove', utils.throttle((e) => {
            this.onMouseMove(e);
        }, 16));

        // Touch events for mobile
        if (utils.isTouchDevice()) {
            this.setupTouchEvents();
        }
    }

    onDOMReady() {
        console.log('DOM Ready');
        this.initializeComponents();
        this.setupAccessibility();
    }

    onPageLoad() {
        console.log('Page Loaded');
        this.isLoaded = true;
        this.initializeAnimations();
        this.preloadAssets();
    }

    onResize() {
        const deviceType = utils.getDeviceType();
        document.body.setAttribute('data-device', deviceType);
        
        // Update canvas sizes if they exist
        if (window.animationManager && window.animationManager.canvas) {
            window.animationManager.resizeCanvas();
        }
    }

    onScroll() {
        const scrollY = window.pageYOffset;
        
        // Update CSS custom property for scroll-based animations
        document.documentElement.style.setProperty('--scroll-y', scrollY + 'px');
        
        // Parallax effects
        this.updateParallaxElements(scrollY);
    }

    onKeyDown(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            const hamburger = utils.$('#hamburger');
            const navMenu = utils.$('#nav-menu');
            
            if (utils.hasClass(navMenu, 'active')) {
                utils.removeClass(hamburger, 'active');
                utils.removeClass(navMenu, 'active');
                document.body.style.overflow = '';
            }
        }

        // Tab navigation accessibility
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    }

    onMouseMove(e) {
        // Remove keyboard navigation class on mouse move
        document.body.classList.remove('keyboard-navigation');
        
        // Update cursor position for custom cursor effects
        this.updateCustomCursor(e);
    }

    setupTouchEvents() {
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const touchDiff = touchStartY - touchY;
            
            // Add touch scroll class for CSS animations
            if (Math.abs(touchDiff) > 5) {
                document.body.classList.add('touch-scrolling');
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            setTimeout(() => {
                document.body.classList.remove('touch-scrolling');
            }, 300);
        });
    }

    initializeComponents() {
        // Initialize custom components
        this.initHeroEffects();
        this.initServiceCards();
        this.initPortfolioGallery();
        this.initContactEnhancements();
    }

    initializeFeatures() {
        // Performance monitoring
        this.setupPerformanceMonitoring();
        
        // Error handling
        this.setupErrorHandling();
        
        // Analytics (if needed)
        this.setupAnalytics();
    }

    initializeAnimations() {
        // Stagger animations for hero elements
        const heroElements = utils.$$('.hero-content > *');
        if (heroElements.length > 0) {
            window.animationManager?.staggerAnimation(heroElements, 'animate-fade-in-up', 200);
        }
    }

    // Hero Effects
    initHeroEffects() {
        const hero = utils.$('.hero');
        if (!hero) return;

        // Floating orbs animation
        this.animateFloatingOrbs();
        
        // Mouse parallax effect
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const orbs = utils.$$('.gradient-orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.02;
                const xOffset = (x - 0.5) * 50 * speed;
                const yOffset = (y - 0.5) * 50 * speed;
                
                orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            });
        });
    }

    animateFloatingOrbs() {
        const orbs = utils.$$('.gradient-orb');
        
        orbs.forEach((orb, index) => {
            const duration = 8000 + (index * 1000);
            const delay = index * 2000;
            
            orb.style.animationDuration = `${duration}ms`;
            orb.style.animationDelay = `${delay}ms`;
        });
    }

    // Service Cards
    initServiceCards() {
        const serviceCards = utils.$$('.service-card');
        
        serviceCards.forEach(card => {
            // Add hover sound effect (optional)
            card.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
            
            // Add click analytics
            card.addEventListener('click', () => {
                const serviceName = card.querySelector('.service-title')?.textContent;
                this.trackEvent('service_card_click', { service: serviceName });
            });
        });
    }

    // Portfolio Gallery
    initPortfolioGallery() {
        const portfolioItems = utils.$$('.portfolio-item');
        
        portfolioItems.forEach(item => {
            // Lazy load images
            this.setupLazyLoading(item);
            
            // Add lightbox functionality
            const links = item.querySelectorAll('.portfolio-link');
            links.forEach(link => {
                if (link.querySelector('.fa-eye')) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.openLightbox(item);
                    });
                }
            });
        });
    }

    // Contact Enhancements
    initContactEnhancements() {
        const contactSection = utils.$('.contact');
        if (!contactSection) return;

        // Add floating labels animation
        const formGroups = contactSection.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                input.addEventListener('focus', () => {
                    utils.addClass(group, 'focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        utils.removeClass(group, 'focused');
                    }
                });
                
                // Check if input has value on load
                if (input.value) {
                    utils.addClass(group, 'focused');
                }
            }
        });
    }

    // Utility Methods
    updateParallaxElements(scrollY) {
        const parallaxElements = utils.$$('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateCustomCursor(e) {
        const cursor = utils.$('.custom-cursor');
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    }

    setupLazyLoading(element) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('img[data-src]');
                    if (img) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    }

    openLightbox(item) {
        // Create lightbox overlay
        const lightbox = utils.createElement('div', {
            className: 'lightbox-overlay',
            innerHTML: `
                <div class="lightbox-content">
                    <button class="lightbox-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="lightbox-image">
                        <img src="${item.dataset.image || ''}" alt="Portfolio Item">
                    </div>
                    <div class="lightbox-info">
                        <h3>${item.querySelector('h4')?.textContent || ''}</h3>
                        <p>${item.querySelector('p')?.textContent || ''}</p>
                    </div>
                </div>
            `
        });
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => utils.addClass(lightbox, 'active'), 50);
        
        // Close handlers
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const closeLightbox = () => {
            utils.removeClass(lightbox, 'active');
            document.body.style.overflow = '';
            setTimeout(() => lightbox.remove(), 300);
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    playHoverSound() {
        // Optional: Add subtle hover sound
        if (this.audioContext && this.enableSounds) {
            // Create subtle beep sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        }
    }

    setupAccessibility() {
        // Add skip to content link
        const skipLink = utils.createElement('a', {
            href: '#main-content',
            className: 'skip-link',
            innerHTML: 'Перейти к основному содержанию'
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupPerformanceMonitoring() {
        // Monitor performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    
                    console.log(`Page load time: ${loadTime}ms`);
                    
                    // Track slow loads
                    if (loadTime > 3000) {
                        this.trackEvent('slow_page_load', { loadTime });
                    }
                }, 0);
            });
        }
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            this.trackEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno
            });
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            this.trackEvent('promise_rejection', {
                reason: e.reason?.toString()
            });
        });
    }

    setupAnalytics() {
        // Basic analytics tracking
        this.trackEvent('page_view', {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    }

    trackEvent(eventName, data = {}) {
        // Send to analytics service
        console.log('Analytics Event:', eventName, data);
        
        // Example: Send to Google Analytics, Yandex Metrica, etc.
        // gtag('event', eventName, data);
    }

    preloadAssets() {
        // Preload critical images
        const criticalImages = [
            // Add your image URLs here
        ];
        
        if (criticalImages.length > 0) {
            utils.preloadImages(criticalImages)
                .then(() => console.log('Critical images preloaded'))
                .catch(err => console.warn('Failed to preload images:', err));
        }
    }

    handlePageLoad() {
        // Add loaded class to body
        window.addEventListener('load', () => {
            document.body.classList.add('page-loaded');
        });
    }
}

// Initialize application
utils.ready(() => {
    window.webMagicApp = new WebMagicApp();
});

// Add lightbox styles
const lightboxStyles = `
    .lightbox-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: var(--z-modal);
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-base);
    }

    .lightbox-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    .lightbox-content {
        max-width: 90vw;
        max-height: 90vh;
        background: var(--bg-card);
        border-radius: var(--radius-xl);
        padding: var(--space-xl);
        position: relative;
        transform: scale(0.8);
        transition: transform var(--transition-base);
    }

    .lightbox-overlay.active .lightbox-content {
        transform: scale(1);
    }

    .lightbox-close {
        position: absolute;
        top: var(--space-md);
        right: var(--space-md);
        width: 40px;
        height: 40px;
        background: var(--bg-tertiary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-primary);
        transition: all var(--transition-base);
    }

    .lightbox-close:hover {
        background: var(--accent-error);
        color: white;
    }

    .lightbox-image img {
        max-width: 100%;
        height: auto;
        border-radius: var(--radius-lg);
    }

    .lightbox-info {
        margin-top: var(--space-lg);
        text-align: center;
    }

    .lightbox-info h3 {
        color: var(--text-primary);
        margin-bottom: var(--space-sm);
    }

    .lightbox-info p {
        color: var(--text-secondary);
    }

    .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--accent-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: var(--radius-sm);
        z-index: var(--z-tooltip);
        transition: top var(--transition-base);
    }

    .skip-link:focus {
        top: 6px;
    }

    .keyboard-navigation *:focus {
        outline: 2px solid var(--accent-primary);
        outline-offset: 2px;
    }
`;

const lightboxStyleSheet = document.createElement('style');
lightboxStyleSheet.textContent = lightboxStyles;
document.head.appendChild(lightboxStyleSheet);