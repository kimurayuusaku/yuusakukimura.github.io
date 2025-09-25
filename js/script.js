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
        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.smoothScrollTo(target);
                this.closeMobileMenu();
            });
        });

        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

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
        this.workItems = document.querySelectorAll('.work-item-placeholder');
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
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
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
        if (this.form) { 
            this.submitButton = this.form.querySelector('.submit-btn'); 
            this.bindEvents();
        }
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false;
        }

        return true;
    }

    async submitForm(formData) {
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        const mailtoLink = `mailto:yuusakukimura1188@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `お名前: ${name}\nメールアドレス: ${email}\n\nメッセージ:\n${message}`
        )}`;
        window.location.href = mailtoLink;
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
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
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

// HeroTextEffect Controller
class HeroTextEffect {
    constructor() {
        this.heroText = document.querySelector('.hero-text');
    }

    init() {
        if (!this.heroText) return;

        this.heroText.addEventListener('mouseenter', () => this.handleMouseEnter());
        this.heroText.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.heroText.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleMouseEnter() {
        // ここではクラスを追加する必要はありません
    }

    handleMouseLeave() {
        // マウスが離れたら円を非表示にする
        this.heroText.style.setProperty('--mask-size', '0');
    }

    handleMouseMove(e) {
        const rect = this.heroText.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // CSS変数にマウス位置を設定
        this.heroText.style.setProperty('--mask-x', `${x}px`);
        this.heroText.style.setProperty('--mask-y', `${y}px`);

        // マウスが動いたら円を拡大
        this.heroText.style.setProperty('--mask-size', '100px');
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
        this.heroTextEffect = new HeroTextEffect(); // HeroTextEffectを追加
        this.NOTE_API_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://note.com/dododo0125/rss';
        this.listElement = document.getElementById('note-article-list');
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.loadingAnimation.init();
        setTimeout(() => {
            this.navigationController.init();
            this.animationController.init();
            this.workGallery.init();
            this.contactForm.init();
            this.heroTextEffect.init(); // ここで初期化
            this.initializeCustomEffects();
            this.fetchNoteArticles();
        }, 100);
    }

    fetchNoteArticles() {
        if (!this.listElement) {
            console.error('note-article-list要素が見つかりませんでした。');
            return;
        }
        this.listElement.innerHTML = '';
        fetch(this.NOTE_API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status !== 'ok' || !data.items) {
                    console.error('RSS2JSONからのデータ:', data);
                    throw new Error('RSS2JSONで記事の取得に失敗しました。');
                }
                data.items.forEach(item => {
                    const dateObj = new Date(item.pubDate);
                    if (isNaN(dateObj)) {
                        console.warn('不正な日付フォーマット:', item.pubDate);
                        return;
                    }
                    const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
                    const listItem = document.createElement('li');
                    listItem.className = 'note-article-item';
                    listItem.innerHTML = `
                        <time class="article-date">${formattedDate}</time>
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="article-title">
                            ${item.title}
                        </a>
                    `;
                    this.listElement.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('note記事の読み込み中にエラーが発生しました:', error);
                this.listElement.innerHTML = '<li>記事の読み込みに失敗しました。</li>';
            });
    }

    initializeCustomEffects() {
        const throttledScroll = Utils.throttle(() => {
            this.handleCustomScroll();
        }, 16);
        window.addEventListener('scroll', throttledScroll);
        this.addWorkItemHoverEffects();
        this.addTypingEffect();
    }

    handleCustomScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
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
            }, index * 1000 + 7000);
        });
    }
}

// Initialize the application
const app = new PortfolioApp();
app.init();

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
    });
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

class TileAnimation {
    constructor() {
        this.heroGrid = document.querySelector('.hero-grid');
    }

    init() {
        if (!this.heroGrid) {
            return;
        }
        this.createTiles();
        window.addEventListener('resize', () => this.createTiles());
        this.animateTiles();
    }

    createTiles() {
        this.heroGrid.innerHTML = ''; // 既存のタイルをクリア
        const gridWidth = this.heroGrid.clientWidth;
        const gridHeight = this.heroGrid.clientHeight;
        const tileSize = 80;
        const cols = Math.ceil(gridWidth / tileSize);
        const rows = Math.ceil(gridHeight / tileSize);

        for (let i = 0; i < cols * rows; i++) {
            const tile = document.createElement('div');
            tile.classList.add('grid-item');
            this.heroGrid.appendChild(tile);
        }
    }

        animateTiles() {
            const tiles = Array.from(this.heroGrid.children);
            const shuffledTiles = this.shuffleArray(tiles);
            
            // ここで全体の遅延時間を設定（1000ms = 1秒）
            const initialDelay = 2000;

            shuffledTiles.forEach((tile, index) => {
                setTimeout(() => {
                    tile.classList.add('is-active');
                    // 'is-active'クラスを削除したい場合は、以下のように変更
                    // tile.classList.remove('is-active');
                }, initialDelay + (index * 30)); // 全体の遅延時間 + タイルごとの遅延
            });
        }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}


window.addEventListener('DOMContentLoaded', () => {
    new TileAnimation().init();
});

// カスタムカーソル機能
// =======================================================
// 1. カーソル動作の基盤となる共通クラス
// =======================================================
class CursorController {
    constructor(cursorElement) {
        this.cursor = cursorElement;
        this.bindCommonEvents();
        // 初期スタック防止のため、初期はtransitionを無効化
        this.cursor.classList.add('no-transition');
    }

    bindCommonEvents() {
        // マウスの追従処理
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // ウィンドウ外に出た/入った時の処理
        document.addEventListener('mouseleave', () => this.cursor.style.opacity = '0');
        // ページに入った時の処理は、Basic/Heroクラスで上書きされる
        document.addEventListener('mouseenter', this.handlePageEnter.bind(this));
    }

    handleMouseMove(e) {
        // マウスが動いたらtransitionを有効化
        if (this.cursor.classList.contains('no-transition')) {
            this.cursor.classList.remove('no-transition');
        }
        this.cursor.style.left = e.clientX + 'px';
        this.cursor.style.top = e.clientY + 'px';
    }

    // このメソッドは子クラスで実装されます
    handlePageEnter() {}
}

// =======================================================
// 2. その他ページ用クラス (.custom-cursor2 に対応)
// =======================================================
class BasicCursor extends CursorController {
    constructor(cursorElement) {
        super(cursorElement);
        // 常に表示
        this.cursor.style.opacity = '1';
    }

    // ページに入った瞬間、常に表示する
    handlePageEnter() {
        this.cursor.style.opacity = '1';
    }
}

// =======================================================
// 3. index.html用クラス (.custom-cursor に対応)
// =======================================================
class HeroAwareCursor extends CursorController {
    constructor(cursorElement, heroSectionId = 'hero') {
        super(cursorElement);
        this.heroSection = document.getElementById(heroSectionId);
        
        // ヒーローセクションがあるため、初期状態は非表示
        this.cursor.style.opacity = '0';
        
        if (this.heroSection) {
            this.bindHeroEvents();
        }
        // #hero がない場合は、念のため BasicCursor と同じ動作にする
         else {
             this.cursor.style.opacity = '1';
        }
    }

    bindHeroEvents() {
        // ヒーローセクション内の制御
        this.heroSection.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '1'; // ヒーローセクションから出たら表示
        });

        this.heroSection.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '0'; // ヒーローセクションに入ったら非表示
        });
    }

    // ページに入った瞬間、表示を試みる (その後、#heroのmouseenterで制御される)
    handlePageEnter() {
        this.cursor.style.opacity = '1';
    }
}

// =======================================================
// 4. 実行ロジック (ページの状況に応じて適切なクラスを起動)
// =======================================================
// DOMが読み込まれた後に実行
window.addEventListener('load', () => { // 'load'イベントを使うことで、より確実に要素が利用可能になるのを待つ
    const cursorHero = document.querySelector('.custom-cursor');
    const cursorOther = document.querySelector('.custom-cursor2');

    if (cursorHero) {
        // index.htmlなどで .custom-cursor が見つかった場合
        new HeroAwareCursor(cursorHero, 'hero');
    } else if (cursorOther) {
        // その他のページで .custom-cursor2 が見つかった場合
        new BasicCursor(cursorOther);
    }
});
