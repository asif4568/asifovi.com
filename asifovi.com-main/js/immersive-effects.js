// Interactive 3D Elements that follow mouse
function init3DInteractiveElements() {
    const heroSection = document.querySelector('.hero');
    const projectsSection = document.querySelector('.projects');
    
    // Add mouse move listener to hero section
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
            
            // Get the 3D container
            const container = document.getElementById('hero-3d-container');
            if (container) {
                gsap.to(container, {
                    rotationY: xPos,
                    rotationX: -yPos,
                    ease: "power1.out",
                    duration: 1,
                    transformPerspective: 900,
                    transformOrigin: "center"
                });
            }
        });
    }
    
    // Add mouse move listener to projects section
    if (projectsSection) {
        // Add tilt effect to project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                const angleX = (e.clientY - cardCenterY) / 25;
                const angleY = -(e.clientX - cardCenterX) / 25;
                
                gsap.to(card, {
                    rotationX: angleX,
                    rotationY: angleY,
                    duration: 0.5,
                    ease: "power1.out",
                    transformPerspective: 1000,
                    transformOrigin: "center center"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: "power1.out"
                });
            });
        });
    }
}

// Scroll-triggered animations
function initScrollAnimations() {
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Add animate-on-scroll class to elements
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        // Add animation to section headings
        const heading = section.querySelector('.section-title');
        if (heading) {
            heading.classList.add('animate-on-scroll');
            observer.observe(heading);
        }
        
        // Add animation to section content
        const content = section.querySelector('.container > div');
        if (content) {
            content.classList.add('animate-on-scroll');
            observer.observe(content);
        }
        
        // Add animation to cards
        const cards = section.querySelectorAll('.skill-item, .project-card, .service-item, .certification-card, .contact-card');
        cards.forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    });
}

// Enhanced cursor effects
function enhancedCursorEffects() {
    const cursor = document.querySelector('.cursor-glow');
    const cursorSmall = document.querySelector('.cursor-glow-small');
    
    if (!cursor || !cursorSmall) return;
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: "power2.out"
        });
        
        gsap.to(cursorSmall, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    });
    
    // Add different effects for different elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .service-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-active');
            cursorSmall.classList.add('cursor-active');
            
            // Add specific classes based on element type
            if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                cursor.classList.add('cursor-pointer');
            } else if (element.classList.contains('project-card')) {
                cursor.classList.add('cursor-view');
            } else if (element.classList.contains('skill-item')) {
                cursor.classList.add('cursor-info');
            }
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-active', 'cursor-pointer', 'cursor-view', 'cursor-info');
            cursorSmall.classList.remove('cursor-active');
        });
    });
}

// WebGL Fluid Simulation
class FluidSimulation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'webgl-fluid';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        document.body.appendChild(this.canvas);
        
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }
        
        // Configuration
        this.config = {
            TEXTURE_DOWNSAMPLE: 1,
            DENSITY_DISSIPATION: 0.98,
            VELOCITY_DISSIPATION: 0.99,
            PRESSURE_DISSIPATION: 0.8,
            PRESSURE_ITERATIONS: 25,
            CURL: 30,
            SPLAT_RADIUS: 0.005
        };
        
        this.pointers = [];
        this.splatStack = [];
        
        this.resize();
        
        this.lastTime = Date.now();
        this.colorUpdateTimer = 0;
        
        // Initialize shaders and programs
        this.initShaders();
        
        // Default color scheme based on theme
        this.theme = document.documentElement.getAttribute('data-theme') || 'light';
        this.updateBaseColors();
        
        // Event listeners
        window.addEventListener('resize', this.resize.bind(this));
        document.addEventListener('themeChanged', (e) => {
            this.theme = e.detail.theme;
            this.updateBaseColors();
        });
        
        // Mouse interaction
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        
        // Start animation
        this.animate();
        
        // Create random splats
        this.multipleSplats(parseInt(Math.random() * 20) + 5);
    }
    
    updateBaseColors() {
        // Colors based on theme
        if (this.theme === 'dark') {
            this.baseColors = [
                [0.3, 0.8, 0.8],   // Teal
                [0.2, 0.7, 0.9],   // Blue
                [0.1, 0.5, 0.9]    // Darker blue
            ];
        } else {
            this.baseColors = [
                [0.2, 0.3, 0.7],   // Blue
                [0.3, 0.2, 0.5],   // Purple
                [0.4, 0.4, 0.8]    // Lavender
            ];
        }
    }
    
    getColorRamp() {
        const t = Date.now() * 0.001;
        const i1 = Math.floor(t) % this.baseColors.length;
        const i2 = (i1 + 1) % this.baseColors.length;
        const ratio = t - Math.floor(t);
        
        const c1 = this.baseColors[i1];
        const c2 = this.baseColors[i2];
        
        return [
            c1[0] * (1 - ratio) + c2[0] * ratio,
            c1[1] * (1 - ratio) + c2[1] * ratio,
            c1[2] * (1 - ratio) + c2[2] * ratio
        ];
    }
    
    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        
        // Reinitialize if already initialized
        if (this.shaders) {
            this.initFramebuffers();
        }
    }
    
    initShaders() {
        // Initialize GL shaders and programs
        this.shaders = {};
        this.programs = {};
        
        // Define shader code (simplified for explanation)
        const baseVertexShader = `
            precision highp float;
            attribute vec2 aPosition;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform vec2 texelSize;
            void main () {
                vUv = aPosition * 0.5 + 0.5;
                vL = vUv - vec2(texelSize.x, 0.0);
                vR = vUv + vec2(texelSize.x, 0.0);
                vT = vUv + vec2(0.0, texelSize.y);
                vB = vUv - vec2(0.0, texelSize.y);
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `;
        
        const displayShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            void main () {
                vec3 C = texture2D(uTexture, vUv).rgb;
                float a = max(C.r, max(C.g, C.b));
                gl_FragColor = vec4(C, a);
            }
        `;
        
        // Create and compile shaders (simplified implementation)
        const vertexShader = this.compileShader(baseVertexShader, this.gl.VERTEX_SHADER);
        const displayShader = this.compileShader(displayShaderSource, this.gl.FRAGMENT_SHADER);
        
        // Link programs (simplified implementation)
        this.displayProgram = this.createProgram(vertexShader, displayShader);
        
        // Setup vertex data
        this.initBlit();
        
        // Initialize framebuffers
        this.initFramebuffers();
        
        // Additional configuration for the simulation
        this.lastTime = Date.now();
    }
    
    initBlit() {
        // Set up vertex buffer for drawing a quad
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), this.gl.STATIC_DRAW);
        
        // Set up index buffer for drawing two triangles
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), this.gl.STATIC_DRAW);
    }
    
    initFramebuffers() {
        // Set up framebuffers for the simulation
        // This is a simplified implementation
        this.texelSizeX = 1.0 / this.canvas.width;
        this.texelSizeY = 1.0 / this.canvas.height;
        
        // Simple texture creation for display
        this.displayTexture = this.createTexture();
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.canvas.width, this.canvas.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    }
    
    compileShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program link error:', this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return null;
        }
        
        return program;
    }
    
    createTexture() {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        return texture;
    }
    
    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const pointer = this.pointers[0] || this.createPointer();
        
        pointer.moved = true;
        pointer.dx = (e.clientX - pointer.x) * 5.0;
        pointer.dy = (e.clientY - pointer.y) * 5.0;
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        
        // Create a splat based on movement
        this.multipleSplats(1);
    }
    
    onTouchMove(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touches = e.targetTouches;
        
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            let pointer = this.pointers[i];
            
            if (!pointer) pointer = this.createPointer();
            
            pointer.moved = true;
            pointer.dx = (touch.clientX - pointer.x) * 8.0;
            pointer.dy = (touch.clientY - pointer.y) * 8.0;
            pointer.x = touch.clientX - rect.left;
            pointer.y = touch.clientY - rect.top;
        }
        
        // Create splats for touch movement
        this.multipleSplats(1);
    }
    
    onTouchStart(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touches = e.targetTouches;
        
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            let pointer = this.pointers[i];
            
            if (!pointer) pointer = this.createPointer();
            
            pointer.moved = false;
            pointer.x = touch.clientX - rect.left;
            pointer.y = touch.clientY - rect.top;
            pointer.dx = 0;
            pointer.dy = 0;
        }
    }
    
    createPointer() {
        const pointer = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            moved: false
        };
        
        this.pointers.push(pointer);
        return pointer;
    }
    
    multipleSplats(amount) {
        for (let i = 0; i < amount; i++) {
            const color = this.getColorRamp();
            
            // Random position if no pointer moved
            const x = this.pointers[0] && this.pointers[0].moved 
                ? this.pointers[0].x / this.canvas.width 
                : Math.random();
                
            const y = this.pointers[0] && this.pointers[0].moved 
                ? this.pointers[0].y / this.canvas.height 
                : Math.random();
                
            const dx = this.pointers[0] && this.pointers[0].moved 
                ? this.pointers[0].dx * 0.01 
                : (Math.random() * 2 - 1) * 0.01;
                
            const dy = this.pointers[0] && this.pointers[0].moved 
                ? this.pointers[0].dy * 0.01 
                : (Math.random() * 2 - 1) * 0.01;
                
            this.splat(x, y, dx, dy, color);
        }
        
        // Reset moved state
        if (this.pointers[0]) this.pointers[0].moved = false;
    }
    
    splat(x, y, dx, dy, color) {
        // Simplified splat implementation for demonstration
        // In a full implementation, this would update the velocity and density textures
        
        // Add to splat stack to render in the next frame
        this.splatStack.push({x, y, dx, dy, color});
    }
    
    animate() {
        // Main animation loop
        const now = Date.now();
        const dt = Math.min((now - this.lastTime) / 1000, 0.016);
        this.lastTime = now;
        
        // Color update timer
        this.colorUpdateTimer += dt;
        if (this.colorUpdateTimer > 1) {
            this.colorUpdateTimer = 0;
            this.updateBaseColors();
        }
        
        // Create random splats occasionally to keep the animation going
        if (Math.random() < 0.01) {
            this.multipleSplats(parseInt(Math.random() * 3) + 1);
        }
        
        // Render display (simplified)
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        // Use display program (simplified)
        this.gl.useProgram(this.displayProgram);
        
        // Bind vertex buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        const aPosition = this.gl.getAttribLocation(this.displayProgram, 'aPosition');
        this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);
        
        // Bind display texture
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.displayTexture);
        this.gl.uniform1i(this.gl.getUniformLocation(this.displayProgram, 'uTexture'), 0);
        
        // Draw
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
        
        // Continue animation
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Scroll Reveal Animation
class ScrollReveal {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.observer = new IntersectionObserver(this.revealSection.bind(this), {
            threshold: 0.15,
            rootMargin: "0px 0px -100px 0px"
        });
        
        this.sections.forEach(section => {
            section.style.opacity = "0";
            section.style.transform = "translateY(50px)";
            section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            this.observer.observe(section);
        });
    }
    
    revealSection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                
                // Animate child elements
                const childElements = entry.target.querySelectorAll('.service-item, .skill-item, .project-card, .certification-card, .contact-card');
                childElements.forEach((element, index) => {
                    element.style.opacity = "0";
                    element.style.transform = "translateY(30px)";
                    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                    element.style.transitionDelay = `${0.2 + index * 0.1}s`;
                    
                    setTimeout(() => {
                        element.style.opacity = "1";
                        element.style.transform = "translateY(0)";
                    }, 100);
                });
                
                // Stop observing after animation
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Magnetic Buttons
class MagneticElements {
    constructor() {
        this.buttons = document.querySelectorAll('.btn, .service-item, .project-card');
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', this.magnetize.bind(this, button));
            button.addEventListener('mouseleave', this.reset.bind(this, button));
        });
    }
    
    magnetize(element, e) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = (e.clientX - centerX) / (rect.width / 2);
        const distanceY = (e.clientY - centerY) / (rect.height / 2);
        
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        if (distance < 1) {
            gsap.to(element, {
                x: distanceX * 15,
                y: distanceY * 15,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }
    
    reset(element) {
        gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    }
}

// Kinetic Typography Effect
function initKineticTypography() {
    const titles = document.querySelectorAll('.section-title');
    
    titles.forEach(title => {
        // Get the original text
        const text = title.textContent;
        let html = '';
        
        // Split text into individual characters with spans
        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                html += ' ';
            } else {
                html += `<span class="kinetic-char">${text[i]}</span>`;
            }
        }
        
        // Replace the title with the new HTML
        title.innerHTML = html;
        
        // Add event listeners for the title
        title.addEventListener('mouseenter', () => {
            const chars = title.querySelectorAll('.kinetic-char');
            chars.forEach((char, index) => {
                char.style.animationDelay = `${index * 0.03}s`;
                char.classList.add('kinetic-hover');
            });
        });
        
        title.addEventListener('mouseleave', () => {
            const chars = title.querySelectorAll('.kinetic-char');
            chars.forEach(char => {
                char.classList.remove('kinetic-hover');
            });
        });
    });
}

// Water Ripple Effect
class WaterRipple {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'water-ripple';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.style.opacity = '0.7';
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Create two arrays for the ripple data (current and previous state)
        this.rippleData1 = new Array(this.width * this.height).fill(0);
        this.rippleData2 = new Array(this.width * this.height).fill(0);
        this.rippleData = this.rippleData1;
        this.prevRippleData = this.rippleData2;
        
        // Variables for ripple effect
        this.rippleRadius = 3;
        this.damping = 0.97;
        
        // Mouse tracking
        this.mouse = {
            x: -1000,
            y: -1000,
            isActive: false,
            moving: false,
            lastX: -1000,
            lastY: -1000
        };
        
        // Theme color setup
        this.updateThemeColors();
        
        // Event listeners
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('touchmove', this.onTouchMove.bind(this));
        window.addEventListener('touchstart', this.onTouchStart.bind(this));
        window.addEventListener('touchend', this.onTouchEnd.bind(this));
        
        // Listen for theme changes
        document.addEventListener('themeChanged', () => {
            this.updateThemeColors();
        });
        
        // Start animation
        this.lastTime = Date.now();
        this.animate();
        
        // Create initial ripples
        this.createRandomRipples();
    }
    
    updateThemeColors() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        
        if (theme === 'dark') {
            this.rippleColor = [76, 195, 208]; // Teal
        } else {
            this.rippleColor = [51, 76, 176]; // Blue
        }
    }
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Resize ripple data arrays
        this.rippleData1 = new Array(this.width * this.height).fill(0);
        this.rippleData2 = new Array(this.width * this.height).fill(0);
        this.rippleData = this.rippleData1;
        this.prevRippleData = this.rippleData2;
    }
    
    onMouseMove(e) {
        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.moving = true;
        
        // Create ripple from mouse movement if active
        if (this.mouse.isActive) {
            this.createRipple(this.mouse.x, this.mouse.y, 5);
        } else if (Math.random() < 0.05) {
            // Occasionally create small ripple on mouse movement
            this.createRipple(this.mouse.x, this.mouse.y, 2);
        }
    }
    
    onMouseDown(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.isActive = true;
        this.createRipple(this.mouse.x, this.mouse.y, 7);
    }
    
    onMouseUp() {
        this.mouse.isActive = false;
    }
    
    onTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;
        this.mouse.x = touch.clientX;
        this.mouse.y = touch.clientY;
        this.mouse.moving = true;
        
        if (this.mouse.isActive) {
            this.createRipple(this.mouse.x, this.mouse.y, 5);
        }
    }
    
    onTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.mouse.x = touch.clientX;
        this.mouse.y = touch.clientY;
        this.mouse.isActive = true;
        this.createRipple(this.mouse.x, this.mouse.y, 7);
    }
    
    onTouchEnd() {
        this.mouse.isActive = false;
    }
    
    createRipple(x, y, size) {
        // Ensure coordinates are within bounds
        x = Math.floor(x);
        y = Math.floor(y);
        
        if (x < 1 || x > this.width - 1 || y < 1 || y > this.height - 1) return;
        
        // Create ripple at the mouse position
        const index = y * this.width + x;
        this.rippleData[index] = size * 50; // Ripple strength
    }
    
    createRandomRipples() {
        // Create 3-5 random ripples
        const count = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * (this.width - 2)) + 1;
            const y = Math.floor(Math.random() * (this.height - 2)) + 1;
            const size = Math.random() * 5 + 3;
            
            this.createRipple(x, y, size);
        }
        
        // Schedule next random ripples
        setTimeout(() => {
            this.createRandomRipples();
        }, Math.random() * 5000 + 2000);
    }
    
    animate() {
        // Main animation loop
        this.updateRipples();
        this.renderRipples();
        
        // Reset mouse movement flag after processing
        this.mouse.moving = false;
        
        requestAnimationFrame(this.animate.bind(this));
    }
    
    updateRipples() {
        // Calculate ripple physics
        const { width, height, rippleData, prevRippleData, damping } = this;
        
        // Swap data arrays
        const temp = this.rippleData;
        this.rippleData = this.prevRippleData;
        this.prevRippleData = temp;
        
        // Update ripple state
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const index = y * width + x;
                
                // Calculate average of surrounding points
                const top = prevRippleData[index - width];
                const bottom = prevRippleData[index + width];
                const left = prevRippleData[index - 1];
                const right = prevRippleData[index + 1];
                
                // New value based on wave equation
                let newVal = (top + bottom + left + right) / 2 - rippleData[index];
                
                // Apply damping
                newVal *= damping;
                
                // Store new value
                rippleData[index] = newVal;
            }
        }
    }
    
    renderRipples() {
        // Create image data from ripple values
        const { ctx, width, height, rippleData, rippleColor } = this;
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        for (let i = 0; i < rippleData.length; i++) {
            const value = Math.abs(rippleData[i]);
            const index = i * 4;
            
            if (value > 0) {
                // Set color based on ripple intensity
                const intensity = Math.min(value / 20, 1);
                data[index] = rippleColor[0]; // R
                data[index + 1] = rippleColor[1]; // G
                data[index + 2] = rippleColor[2]; // B
                data[index + 3] = 255 * intensity * 0.3; // A
            } else {
                // Transparent if no ripple
                data[index + 3] = 0;
            }
        }
        
        // Put the image data on the canvas
        ctx.putImageData(imageData, 0, 0);
    }
}

// Magnetic effect for interactive elements
function initMagneticElements() {
    const elements = document.querySelectorAll('.btn, .project-card, .service-item, .skill-item');
    
    elements.forEach(element => {
        element.addEventListener('mousemove', e => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate distance from center (0-1)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const distanceX = (x - centerX) / centerX;
            const distanceY = (y - centerY) / centerY;
            
            // Apply magnetic effect
            gsap.to(element, {
                x: distanceX * 15,
                y: distanceY * 15,
                rotation: distanceX * 5,
                ease: "power2.out",
                duration: 0.5
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                rotation: 0,
                ease: "elastic.out(1, 0.3)",
                duration: 0.7
            });
        });
    });
}

// Smooth scroll effect
function initSmoothScroll() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Add animation class
                targetElement.classList.add('scroll-highlight');
                
                // Scroll to element
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for header
                    behavior: 'smooth'
                });
                
                // Remove animation class after delay
                setTimeout(() => {
                    targetElement.classList.remove('scroll-highlight');
                }, 2000);
            }
        });
    });
}

// Image hover parallax effect
function initImageParallax() {
    const images = document.querySelectorAll('.project-img img, .profile-image img');
    
    images.forEach(image => {
        const parent = image.parentElement;
        
        // Create container for 3D effect
        parent.style.perspective = '1000px';
        parent.style.overflow = 'hidden';
        
        // Prepare image for transform
        image.style.transition = 'transform 0.2s ease-out';
        
        parent.addEventListener('mousemove', e => {
            const rect = parent.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            const rotateY = -((x / rect.width) - 0.5) * 20;
            const rotateX = ((y / rect.height) - 0.5) * 20;
            
            // Apply transform
            image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
        });
        
        parent.addEventListener('mouseleave', () => {
            image.style.transform = 'rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for kinetic typography
    const style = document.createElement('style');
    style.textContent = `
        .kinetic-char {
            display: inline-block;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease;
        }
        
        .kinetic-hover {
            animation: float 1s ease-in-out infinite;
            color: var(--primary-color);
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .scroll-highlight {
            animation: highlight 2s ease;
        }
        
        @keyframes highlight {
            0% { box-shadow: 0 0 0 rgba(var(--primary-rgb), 0); }
            25% { box-shadow: 0 0 30px rgba(var(--primary-rgb), 0.5); }
            100% { box-shadow: 0 0 0 rgba(var(--primary-rgb), 0); }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize effects
    initKineticTypography();
    initMagneticElements();
    initSmoothScroll();
    initImageParallax();
    
    // Initialize water ripple effect and store it globally
    window.waterRippleInstance = new WaterRipple();
}); 