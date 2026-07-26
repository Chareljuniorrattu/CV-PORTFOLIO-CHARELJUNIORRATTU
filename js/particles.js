// PARTICLES - efek background (opsional)

document.addEventListener('DOMContentLoaded', function() {
    // matiin di hp biar ga berat
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    `;
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // ngikutin cursor
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // bikin partikel
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // biar ga keluar layar
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            
            // interaksi sama mouse
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.x += (dx / distance) * force * 0.5;
                this.y += (dy / distance) * force * 0.5;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // jumlah partikel
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 10));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // garis antar partikel
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    // loop animasi
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawLines();
        requestAnimationFrame(animate);
    }
    
    animate();
});