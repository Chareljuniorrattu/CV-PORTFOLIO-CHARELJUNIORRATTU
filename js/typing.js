// TYPING - efek ngetik di hero

document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.getElementById('typing');
    
    if (!typingElement) return;
    
    // teks yang bakal muncul bergantian
    const texts = [
        'Web Developer',
        'UI/UX Enthusiast',
        'JavaScript Learner',
        'Bootstrap User',
        'Java Programmer',
        'Technology Explorer'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // hapus karakter
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // tambah karakter
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // kalo udah selesai ngetik, jeda dulu
        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        }
        
        // kalo udah selesai hapus, ganti teks
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // jalanin efeknya
    setTimeout(typeEffect, 1000);
});