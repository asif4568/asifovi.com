// Interactive Particle System
document.addEventListener('DOMContentLoaded', function() {
    // Create canvas element for particles
    const particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'particle-canvas';
    particleCanvas.style.position = 'fixed';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.pointerEvents = 'none';
    particleCanvas.style.zIndex = '1';
    particleCanvas.style.opacity = '0.7';
    document.body.appendChild(particleCanvas);
    
    // Initialize particles
    initParticles();
});

function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Theme detection for particle color
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const particleBaseColor = isDarkTheme ? '76, 195, 208' : '51, 76, 176';
    const particleSize = 2;
    
    // Create particles
    const particlesArray = [];
    const numberOfParticles = Math.min(100, Math.floor(window.innerWidth / 20));
    
    // Mouse position tracking
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * particleSize + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.color = `rgba(${particleBaseColor}, ${Math.random() * 0.8 + 0.2})`;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        update() {
            // Check if mouse is close enough to move particle
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                
                // Maximum distance, past which the force is 0
                const maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                
                // If we're too far away, force = 0
                if (force < 0) force = 0;
                
                // Movement based on force
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;
                
                if (distance < mouse.radius) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    // Return to original position
                    if (this.x !== this.baseX) {
                        const dx = this.x - this.baseX;
                        this.x -= dx / 10;
                    }
                    if (this.y !== this.baseY) {
                        const dy = this.y - this.baseY;
                        this.y -= dy / 10;
                    }
                }
            }
        }
    }
    
    // Initialize particles
    function init() {
        particlesArray.length = 0;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Connect close particles with lines
        connectParticles();
        
        // Update and draw particles
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Connect close particles with lines
    function connectParticles() {
        const maxDistance = canvas.width / 7;
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(${particleBaseColor}, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
    
    // Handle theme change
    document.addEventListener('themeChanged', function(e) {
        const isDarkTheme = e.detail.theme === 'dark';
        const newParticleBaseColor = isDarkTheme ? '76, 195, 208' : '51, 76, 176';
        
        // Update particle colors
        particlesArray.forEach(particle => {
            const opacity = parseFloat(particle.color.split(',')[3]);
            particle.color = `rgba(${newParticleBaseColor}, ${opacity})`;
        });
    });
    
    // Initialize particles and start animation
    init();
    animate();
} 