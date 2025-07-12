// Navigation Controller
class NavigationController {
    constructor() {
        this.header = document.getElementById('header');
        this.navMenu = document.getElementById('nav-menu');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScrollY = window.scrollY;
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Hamburger menu toggle
        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.smoothScrollTo(target);
                this.closeMobileMenu();
            });
        });

        // Scroll event
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class to header
        if (currentScrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        this.lastScrollY = currentScrollY;
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = this.header.offsetHeight;
            const elementPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Animation Controller
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
    }

    init() {
        this.observeElements();
        this.initParallax();
        this.initSkillBars();
    }

    observeElements() {
        const elementsToObserve = document.querySelectorAll('.work-item, .fade-in, .skill-item');
        elementsToObserve.forEach(element => {
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-item')) {
                    this.animateSkillBar(entry.target);
                }
            }
        });
    }

    animateSkillBar(skillItem) {
        const progressBar = skillItem.querySelector('.skill-progress');
        const progress = progressBar.getAttribute('data-progress');
        
        setTimeout(() => {
            progressBar.style.width = progress + '%';
        }, 200);
    }

    initParallax() {
        window.addEventListener('scroll', () => {
            this.updateParallax();
        });
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    initSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            item.classList.add('fade-in');
        });
    }

    fadeInOnScroll(element) {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    }
}

// Work Gallery Controller
class WorkGallery {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.workItems = document.querySelectorAll('.work-item');
        this.workGrid = document.getElementById('work-grid');
    }

    init() {
        this.bindEvents();
        this.showAllItems();
    }

    bindEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleFilterClick(button);
            });
        });
    }

    handleFilterClick(button) {
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter items
        const filter = button.getAttribute('data-filter');
        this.filterWorks(filter);
    }

    filterWorks(category) {
        this.workItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.add('visible');
                }, 100);
            } else {
                item.classList.remove('visible');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    showAllItems() {
        this.workItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100);
        });
    }
}

// Contact Form Controller
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.btnText = this.submitBtn.querySelector('.btn-text');
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        
        if (!this.validateForm(formData)) {
            this.showMessage('すべての項目を正しく入力してください。', 'error');
            return;
        }

        this.setLoadingState(true);

        try {
            await this.submitForm(formData);
            this.showMessage('メッセージが送信されました。ありがとうございます！', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('送信に失敗しました。もう一度お試しください。', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm(formData) {
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();

        if (!name || !email || !subject || !message) {
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false;
        }

        return true;
    }

    async submitForm(formData) {
        // Simulate form submission with mailto
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        const mailtoLink = `mailto:yusaku.kimura@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `お名前: ${name}\nメールアドレス: ${email}\n\nメッセージ:\n${message}`
        )}`;

        // Open mail client
        window.location.href = mailtoLink;

        // Simulate async operation
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }

    showMessage(message, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #4CAF50;' : 'background: #f44336;'}
        `;

        document.body.appendChild(messageEl);

        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 5000);
    }
}

// Loading Animation Controller
class LoadingAnimation {
    constructor() {
        this.loadingScreen = document.getElementById('loading');
        this.loadingProgress = document.querySelector('.loading-progress');
        this.progress = 0;
    }

    init() {
        this.startLoading();
    }

    startLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    this.hide();
                }, 500);
            }
            
            this.updateProgress(this.progress);
        }, 100);
    }

    updateProgress(percentage) {
        if (this.loadingProgress) {
            this.loadingProgress.style.width = percentage + '%';
        }
    }

    hide() {
        this.loadingScreen.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Main Application
class PortfolioApp {
    constructor() {
        this.navigationController = new NavigationController();
        this.animationController = new AnimationController();
        this.workGallery = new WorkGallery();
        this.contactForm = new ContactForm();
        this.loadingAnimation = new LoadingAnimation();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // Initialize loading animation first
        this.loadingAnimation.init();

        // Initialize other components after a short delay
        setTimeout(() => {
            this.navigationController.init();
            this.animationController.init();
            this.workGallery.init();
            this.contactForm.init();
            this.initializeCustomEffects();
        }, 100);
    }

    initializeCustomEffects() {
        // Add custom scroll effects
        const throttledScroll = Utils.throttle(() => {
            this.handleCustomScroll();
        }, 16);

        window.addEventListener('scroll', throttledScroll);

        // Add hover effects for work items
        this.addWorkItemHoverEffects();

        // Add typing effect for hero title
        this.addTypingEffect();
    }

    handleCustomScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Parallax effect for hero background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    }

    addWorkItemHoverEffects() {
        const workItems = document.querySelectorAll('.work-item');
        
        workItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px) scale(1.02)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    addTypingEffect() {
        const heroTitleLines = document.querySelectorAll('.hero-title-line');
        
        heroTitleLines.forEach((line, index) => {
            const text = line.textContent;
            line.textContent = '';
            
            setTimeout(() => {
                let i = 0;
                const typeInterval = setInterval(() => {
                    line.textContent += text.charAt(i);
                    i++;
                    if (i >= text.length) {
                        clearInterval(typeInterval);
                    }
                }, 100);
            }, index * 1000 + 1500);
        });
    }
}

// Initialize the application
const app = new PortfolioApp();
app.init();

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth reveal animation for sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
    });

    // Add click effect for buttons
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
