// SCROLL - efek & animasi

document.addEventListener('DOMContentLoaded', function() {
    
    // REVEAL - element muncul pas di-scroll
    const revealElements = document.querySelectorAll(
        '.about-card, .skill-box, .project-card, ' +
        '.service-card, .achievement-card, .counter-box, ' +
        '.timeline-item, .gallery-item, .contact-info, .contact-form'
    );
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                entry.target.style.opacity = '1';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // awal semua hidden
    revealElements.forEach(el => {
        el.style.opacity = '0';
        revealObserver.observe(el);
    });
    
    // PARALLAX - gambar hero gerak sedikit
    const heroSection = document.getElementById('home');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroImage = document.querySelector('.hero-image img');
            
            if (heroImage && scrolled < 600) {
                heroImage.style.transform = `translateY(${scrolled * 0.05}px)`;
            }
        });
    }
    
    // PROGRESS BAR - jalan pas keliatan
    const progressBars = document.querySelectorAll('.progress-bar');

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                
                let targetWidth = bar.dataset.width || bar.style.width;
                
                if (!targetWidth || targetWidth === '0%') {
                    const classes = bar.className.split(' ');
                    const skillClass = classes.find(c => 
                        ['html', 'css', 'bootstrap', 'javascript', 'java', 'git'].includes(c)
                    );
                    if (skillClass) {
                        const widthMap = {
                            'html': '95%',
                            'css': '90%',
                            'bootstrap': '90%',
                            'javascript': '85%',
                            'java': '80%',
                            'git': '85%'
                        };
                        targetWidth = widthMap[skillClass] || '0%';
                    }
                }
                
                bar.style.width = '0%';
                bar.style.transition = 'none';
                void bar.offsetWidth;
                
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    bar.style.width = targetWidth;
                }, 100);
                
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    progressBars.forEach(bar => {
        const classes = bar.className.split(' ');
        const skillClass = classes.find(c => 
            ['html', 'css', 'bootstrap', 'javascript', 'java', 'git'].includes(c)
        );
        
        const widthMap = {
            'html': '95%',
            'css': '90%',
            'bootstrap': '90%',
            'javascript': '85%',
            'java': '80%',
            'git': '85%'
        };
        
        if (skillClass && widthMap[skillClass]) {
            bar.dataset.width = widthMap[skillClass];
            bar.style.width = '0%';
            progressObserver.observe(bar);
        }
    });
    
    // NAVBAR - sembunyi pas scroll ke bawah
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.transition = 'transform 0.3s ease';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // PROGRESS INDICATOR - garis di atas pas scroll
    const progressIndicator = document.createElement('div');
    progressIndicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3B82F6, #60A5FA);
        z-index: 99999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressIndicator);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressIndicator.style.width = scrollPercent + '%';
    });
    
    // SECTION TITLE - muncul pas di-scroll
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    title.style.opacity = '1';
                    title.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        title.style.opacity = '0';
        title.style.transform = 'translateY(30px)';
        title.style.transition = 'all 0.8s ease';
        observer.observe(title);
    });
});

// UTILITY - throttle buat ngejaga performa
function throttle(func, limit) {
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