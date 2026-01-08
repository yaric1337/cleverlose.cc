// Component System

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.init();
    }

    init() {
        this.initNavigation();
        this.initThemeToggle();
        this.initContactForm();
        this.initPortfolioFilter();
        this.initPreloader();
        this.initScrollEffects();
    }

    // Navigation Component
    initNavigation() {
        const navbar = utils.$('#navbar');
        const hamburger = utils.$('#hamburger');
        const navMenu = utils.$('#nav-menu');
        const navLinks = utils.$$('.nav-link');

        if (!navbar || !hamburger || !navMenu) return;

        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            utils.toggleClass(hamburger, 'active');
            utils.toggleClass(navMenu, 'active');
            document.body.style.overflow = utils.hasClass(navMenu, 'active') ? 'hidden' : '';
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                utils.removeClass(hamburger, 'active');
                utils.removeClass(navMenu, 'active');
                document.body.style.overflow = '';
            });
        });

        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = utils.$(targetId);
                
                if (targetElement) {
                    utils.scrollTo(targetElement, 80);
                    
                    // Update active link
                    navLinks.forEach(l => utils.removeClass(l, 'active'));
                    utils.addClass(link, 'active');
                }
            });
        });

        // Navbar scroll effect
        const handleScroll = utils.throttle(() => {
            const scrollY = window.pageYOffset;
            
            if (scrollY > 100) {
                utils.addClass(navbar, 'scrolled');
            } else {
                utils.removeClass(navbar, 'scrolled');
            }

            // Update active navigation based on scroll position
            this.updateActiveNavigation();
        }, 16);

        window.addEventListener('scroll', handleScroll);

        // Close mobile menu on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                utils.removeClass(hamburger, 'active');
                utils.removeClass(navMenu, 'active');
                document.body.style.overflow = '';
            }
        });
    }

    updateActiveNavigation() {
        const sections = utils.$$('section[id]');
        const navLinks = utils.$$('.nav-link');
        const scrollY = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    utils.removeClass(link, 'active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        utils.addClass(link, 'active');
                    }
                });
            }
        });
    }

    // Theme Toggle Component
    initThemeToggle() {
        const themeToggle = utils.$('#theme-toggle');
        if (!themeToggle) return;

        const currentTheme = utils.storage.get('theme', 'dark');
        this.setTheme(currentTheme);

        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            utils.storage.set('theme', newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = utils.$('#theme-toggle');
        const icon = themeToggle?.querySelector('i');
        
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Contact Form Component
    initContactForm() {
        const form = utils.$('#contact-form');
        if (!form) return;

        const submitBtn = form.querySelector('.submit-btn');
        const inputs = form.querySelectorAll('input, textarea');

        // Form validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm(form)) return;

            utils.addClass(submitBtn, 'loading');
            submitBtn.disabled = true;

            try {
                // Simulate form submission
                await this.submitForm(new FormData(form));
                this.showFormSuccess();
                form.reset();
            } catch (error) {
                this.showFormError(error.message);
            } finally {
                utils.removeClass(submitBtn, 'loading');
                submitBtn.disabled = false;
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let message = '';

        // Remove existing error
        this.clearFieldError(field);

        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Это поле обязательно для заполнения';
        }

        // Email validation
        if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Введите корректный email адрес';
        }

        if (!isValid) {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    validateForm(form) {
        const fields = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        utils.addClass(field, 'error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        utils.removeClass(field, 'error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async submitForm(formData) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/error
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Произошла ошибка при отправке формы'));
                }
            }, 2000);
        });
    }

    showFormSuccess() {
        this.showNotification('Сообщение успешно отправлено!', 'success');
    }

    showFormError(message) {
        this.showNotification(message, 'error');
    }

    // Portfolio Filter Component
    initPortfolioFilter() {
        const filterButtons = utils.$$('.filter-btn');
        const portfolioItems = utils.$$('.portfolio-item');

        if (!filterButtons.length || !portfolioItems.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => utils.removeClass(btn, 'active'));
                utils.addClass(button, 'active');
                
                // Filter items
                this.filterPortfolioItems(portfolioItems, filter);
            });
        });
    }

    filterPortfolioItems(items, filter) {
        items.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            setTimeout(() => {
                if (shouldShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            }, index * 50);
        });
    }

    // Preloader Component
    initPreloader() {
        const preloader = utils.$('#preloader');
        if (!preloader) return;

        // Hide preloader after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                utils.addClass(preloader, 'hidden');
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }, 1000);
        });
    }

    // Scroll Effects Component
    initScrollEffects() {
        this.initScrollToTop();
        this.initScrollProgress();
    }

    initScrollToTop() {
        // Create scroll to top button
        const scrollBtn = utils.createElement('button', {
            className: 'scroll-to-top',
            innerHTML: '<i class="fas fa-chevron-up"></i>'
        });

        document.body.appendChild(scrollBtn);

        // Show/hide button based on scroll position
        const handleScroll = utils.throttle(() => {
            const scrollY = window.pageYOffset;
            
            if (scrollY > 500) {
                utils.addClass(scrollBtn, 'visible');
            } else {
                utils.removeClass(scrollBtn, 'visible');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);

        // Scroll to top on click
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    initScrollProgress() {
        // Create scroll progress bar
        const progressBar = utils.createElement('div', {
            className: 'scroll-progress'
        });

        document.body.appendChild(progressBar);

        // Update progress based on scroll position
        const updateProgress = utils.throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = `${scrollPercent}%`;
        }, 16);

        window.addEventListener('scroll', updateProgress);
    }

    // Notification System
    showNotification(message, type = 'info', duration = 5000) {
        const notification = utils.createElement('div', {
            className: `notification notification-${type}`,
            innerHTML: `
                <div class="notification-content">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            `
        });

        // Add to container or create one
        let container = utils.$('.notification-container');
        if (!container) {
            container = utils.createElement('div', {
                className: 'notification-container'
            });
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Animate in
        setTimeout(() => utils.addClass(notification, 'show'), 100);

        // Auto remove
        const removeNotification = () => {
            utils.removeClass(notification, 'show');
            setTimeout(() => notification.remove(), 300);
        };

        setTimeout(removeNotification, duration);

        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', removeNotification);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize components when DOM is ready
utils.ready(() => {
    window.componentManager = new ComponentManager();
});

// Add component styles
const componentStyles = `
    .field-error {
        color: var(--accent-error);
        font-size: var(--text-xs);
        margin-top: var(--space-xs);
    }

    .scroll-to-top {
        position: fixed;
        bottom: var(--space-xl);
        right: var(--space-xl);
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all var(--transition-base);
        z-index: var(--z-fixed);
        box-shadow: var(--shadow-lg);
    }

    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .scroll-to-top:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-xl);
    }

    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--gradient-primary);
        z-index: var(--z-fixed);
        transition: width 0.1s ease;
    }

    .notification-container {
        position: fixed;
        top: var(--space-xl);
        right: var(--space-xl);
        z-index: var(--z-toast);
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
    }

    .notification {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-lg);
        padding: var(--space-lg);
        min-width: 300px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transform: translateX(100%);
        opacity: 0;
        transition: all var(--transition-base);
        box-shadow: var(--shadow-lg);
    }

    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        color: var(--text-primary);
    }

    .notification-success {
        border-left: 4px solid var(--accent-success);
    }

    .notification-error {
        border-left: 4px solid var(--accent-error);
    }

    .notification-warning {
        border-left: 4px solid var(--accent-warning);
    }

    .notification-info {
        border-left: 4px solid var(--accent-primary);
    }

    .notification-close {
        background: none;
        border: none;
        color: var(--text-tertiary);
        cursor: pointer;
        padding: var(--space-xs);
        border-radius: var(--radius-sm);
        transition: all var(--transition-base);
    }

    .notification-close:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }

    @media (max-width: 768px) {
        .notification-container {
            top: var(--space-md);
            right: var(--space-md);
            left: var(--space-md);
        }

        .notification {
            min-width: auto;
        }

        .scroll-to-top {
            bottom: var(--space-lg);
            right: var(--space-lg);
            width: 45px;
            height: 45px;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = componentStyles;
document.head.appendChild(styleSheet);