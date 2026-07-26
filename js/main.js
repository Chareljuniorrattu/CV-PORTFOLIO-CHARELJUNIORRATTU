// LOADER
window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.classList.add("fade-out");
        setTimeout(() => {
            loader.style.display = "none";
        }, 600);
    }
});

// NAVBAR - berubah pas di-scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 50));

// COUNTER - jalan pas keliatan di layar
const counters = document.querySelectorAll(".counter");

const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-target")) || 0;
    if (target === 0) return;
    
    const duration = 2000;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.ceil(progress * target);
        
        counter.innerText = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            counter.innerText = target + "+";
        }
    };
    
    requestAnimationFrame(updateCounter);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.5
});

counters.forEach(counter => observer.observe(counter));

// BACK TO TOP
const topBtn = document.getElementById("topBtn");

if (topBtn) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
    });

    topBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// SMOOTH SCROLL buat semua link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ACTIVE NAV LINK - highlight menu sesuai section
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', throttle(() => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 50));

// FORM - kirim via AJAX ga pake redirect
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[name="name"]');
        const email = this.querySelector('input[name="email"]');
        const message = this.querySelector('textarea[name="message"]');
        
        // validasi dulu
        if (name.value.trim() === '') {
            showMessage('Silakan isi nama Anda', 'error');
            name.focus();
            return;
        }
        
        if (email.value.trim() === '') {
            showMessage('Silakan isi email Anda', 'error');
            email.focus();
            return;
        }
        
        if (!isValidEmail(email.value)) {
            showMessage('Email tidak valid', 'error');
            email.focus();
            return;
        }
        
        if (message.value.trim() === '') {
            showMessage('Silakan tulis pesan Anda', 'error');
            message.focus();
            return;
        }
        
        // kirim ke formspree
        const formData = new FormData(this);
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;
        
        fetch('https://formspree.io/f/mvzevnrj', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showMessage('✅ Pesan berhasil dikirim!', 'success');
                contactForm.reset();
            } else {
                showMessage('❌ Gagal mengirim. Coba lagi.', 'error');
            }
        })
        .catch(error => {
            showMessage('❌ Terjadi kesalahan. Coba lagi.', 'error');
            console.log('Error:', error);
        })
        .finally(() => {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim';
            submitBtn.disabled = false;
        });
    });
}

// buat nampilin pesan sukses/gagal
function showMessage(msg, type) {
    formMessage.style.display = 'block';
    formMessage.textContent = msg;
    formMessage.style.background = type === 'success' ? '#064E3B' : '#7F1D1D';
    formMessage.style.color = 'white';
    formMessage.style.border = type === 'success' ? '1px solid #10B981' : '1px solid #EF4444';
    
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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