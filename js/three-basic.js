// Basic Three.js implementation for portfolio with enhanced animations
document.addEventListener('DOMContentLoaded', function() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined' || typeof gsap === 'undefined') {
        console.error('Required libraries (Three.js or GSAP) are not loaded!');
        return;
    }

    // First, thoroughly remove any 3D elements from the sections that should be transparent
    removeUnnecessary3DBackgrounds();

    // Get theme
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const primaryColor = isDarkTheme ? 0x4cc3d0 : 0x334cb0;
    const secondaryColor = isDarkTheme ? 0x25aebe : 0x3596a6;
    
    // Animation timing variables for smooth consistent animations
    const ANIMATION = {
        duration: {
            slow: 2.5,
            medium: 1.5,
            fast: 0.8
        },
        ease: {
            smooth: "power2.inOut",
            bounce: "elastic.out(1, 0.3)",
            gentle: "sine.inOut"
        }
    };
    
    // Global timing for synchronized animations
    const globalClock = {
        time: 0,
        delta: 0,
        lastTime: performance.now() / 1000
    };
    
    // Update global clock (called in each animation loop)
    function updateClock() {
        const currentTime = performance.now() / 1000;
        globalClock.delta = currentTime - globalClock.lastTime;
        globalClock.time += globalClock.delta;
        globalClock.lastTime = currentTime;
        return globalClock;
    }
    
    // Animation handler to manage all scenes
    const animationHandler = {
        scenes: [],
        
        // Register a scene to be animated
        register(animateFunction) {
            this.scenes.push(animateFunction);
            return this.scenes.length - 1;
        },
        
        // Remove a scene from animation
        unregister(index) {
            if (index >= 0 && index < this.scenes.length) {
                this.scenes.splice(index, 1);
            }
        },
        
        // Main animation loop with proper timing
        animate() {
            requestAnimationFrame(() => this.animate());
            
            // Update global clock
            updateClock();
            
            // Call all registered scene animation functions
            this.scenes.forEach(animateFn => animateFn(globalClock));
        },
        
        // Start the animation loop
        start() {
            this.animate();
        }
    };
    
    // Initialize mousePosNorm globally for both Hero and Projects scenes
    let mousePosNorm = { x: 0, y: 0 };

    document.addEventListener('mousemove', (event) => {
        // Normalize mouse position between -1 and 1
        mousePosNorm.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePosNorm.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Initialize math utility object for lerp and other animations
    const MATH = {
        lerp: function(a, b, t) {
            return a + (b - a) * t;
        }
    };
    
    // Initialize Hero section 3D background
    function initHeroScene() {
        const container = document.getElementById('hero-3d-container');
        if (!container) return;
        
        // Create scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        camera.position.z = 25;
        
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
        container.appendChild(renderer.domElement);
        
        // Create particle system with initial positions stored for animation
        const particleCount = 1000;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        // Create and store initial positions
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Random position in a sphere
            const radius = 50 + Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Add colors with subtle variation
            colors[i3] = 0.5 + Math.random() * 0.5;
            colors[i3 + 1] = 0.5 + Math.random() * 0.5;
            colors[i3 + 2] = 0.5 + Math.random() * 0.5;
        }
        
        // Store a copy of initial positions for animation reference
        const initialPositions = positions.slice();
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Store initial positions in geometry userData for reference during animation
        particleGeometry.userData.initialPositions = initialPositions;
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);
        
        // Add connecting lines between particles
        const linesMaterial = new THREE.LineBasicMaterial({
            color: secondaryColor,
            transparent: true,
            opacity: 0.1,
            linewidth: 1
        });
        
        const linesGeometry = new THREE.BufferGeometry();
        const linesPositions = new Float32Array(particlesCount * 3); // Simplified for performance
        
        for (let i = 0; i < particlesCount * 3; i += 3) {
            linesPositions[i] = posArray[i];
            linesPositions[i + 1] = posArray[i + 1];
            linesPositions[i + 2] = posArray[i + 2];
        }
        
        linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3));
        const lines = new THREE.LineLoop(linesGeometry, linesMaterial);
        scene.add(lines);
        
        // Add a subtle glow sphere
        const glowGeometry = new THREE.SphereGeometry(16, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: primaryColor,
            transparent: true,
            opacity: 0.05,
            side: THREE.BackSide
        });
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glowSphere);
        
        // Fade in animation with GSAP
        gsap.from(particleMaterial, {
            opacity: 0,
            duration: ANIMATION.duration.medium,
            ease: ANIMATION.ease.smooth
        });
        
        gsap.from(glowMaterial, {
            opacity: 0,
            duration: ANIMATION.duration.slow,
            ease: ANIMATION.ease.smooth
        });
        
        // Animate the entire scene in
        gsap.from(scene.position, {
            y: -10,
            duration: ANIMATION.duration.medium,
            ease: ANIMATION.ease.bounce
        });
        
        // Add ambient lighting to the Hero scene
        const ambientLightHero = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
        scene.add(ambientLightHero);
        
        // Define animation loop
        function animateHeroScene(clock) {
            // Get the mouse position for interactive movement
            const mouseX = (window.innerWidth / 2 - (mousePosNorm.x * window.innerWidth / 2)) * 0.05;
            const mouseY = (window.innerHeight / 2 - (mousePosNorm.y * window.innerHeight / 2)) * 0.05;
            
            // Apply subtle rotation based on mouse position for parallax effect
            particleSystem.rotation.y = MATH.lerp(particleSystem.rotation.y, mouseX * 0.1, 0.05);
            particleSystem.rotation.x = MATH.lerp(particleSystem.rotation.x, mouseY * 0.1, 0.05);
            
            // Create a pulsing effect for particles
            const s = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
            particleSystem.scale.set(s, s, s);
            
            // Create a gentle wave effect for particles
            const positions = particleSystem.geometry.attributes.position.array;
            const initialPositions = particleSystem.geometry.userData.initialPositions;
            
            for (let i = 0; i < positions.length; i += 3) {
                const ix = initialPositions[i];
                const iy = initialPositions[i + 1];
                const iz = initialPositions[i + 2];
                
                const time = clock.getElapsedTime();
                const distance = Math.sqrt(ix * ix + iy * iy + iz * iz);
                
                // Create a wave effect based on distance and time
                positions[i] = ix + Math.sin(time * 0.3 + distance * 0.5) * 0.3;
                positions[i + 1] = iy + Math.cos(time * 0.4 + distance * 0.5) * 0.3;
                positions[i + 2] = iz + Math.sin(time * 0.5 + distance * 0.5) * 0.3;
            }
            
            particleSystem.geometry.attributes.position.needsUpdate = true;
            
            // Add a gentle color pulsing effect
            const hue = (clock.getElapsedTime() * 0.05) % 1;
            const color = new THREE.Color().setHSL(hue, 0.5, 0.7);
            particleSystem.material.color.lerp(color, 0.01);
            
            // Rotate lines in different direction for interesting effect
            lines.rotation.x = Math.cos(clock.time * 0.3) * 0.1;
            lines.rotation.y -= rotationSpeed * 0.8 * clock.delta;
            
            // Pulsate glow sphere
            const pulse = Math.sin(clock.time) * 0.05 + 1;
            glowSphere.scale.set(pulse, pulse, pulse);
            
            // Render the scene
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        function handleResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        
        window.addEventListener('resize', handleResize);
        
        // Register with animation handler
        return animationHandler.register(animateHeroScene);
    }
    
    // Initialize projects section 3D background
    function initProjectsScene() {
        const container = document.getElementById('projects-3d-container');
        if (!container) return;
        
        // Create scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            70, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        camera.position.z = 20;
        
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        
        // Create wireframe sphere
        const sphereGeometry = new THREE.IcosahedronGeometry(10, 2);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: primaryColor,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const sphere = new THREE.Mesh(sphereGeometry, wireframeMaterial);
        scene.add(sphere);
        
        // Add points at vertices
        const pointsGeometry = new THREE.BufferGeometry();
        pointsGeometry.setAttribute('position', sphereGeometry.getAttribute('position'));
        
        const pointsMaterial = new THREE.PointsMaterial({
            color: secondaryColor,
            size: 0.3,
            transparent: true,
            opacity: 0.8
        });
        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        scene.add(points);
        
        // Create orbital objects group
        const objectsGroup = new THREE.Group();
        scene.add(objectsGroup);
        
        // More varied geometries for visual interest
        const geometries = [
            new THREE.TetrahedronGeometry(0.8, 0),
            new THREE.OctahedronGeometry(0.8, 0),
            new THREE.IcosahedronGeometry(0.8, 0),
            new THREE.TorusGeometry(0.5, 0.2, 8, 16),
            new THREE.ConeGeometry(0.5, 0.8, 8)
        ];
        
        const floatingObjects = [];
        
        for (let i = 0; i < 20; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? primaryColor : secondaryColor,
                wireframe: Math.random() > 0.3, // Mix of wireframe and solid
                transparent: true,
                opacity: Math.random() * 0.5 + 0.3
            });
            
            const object = new THREE.Mesh(geometry, material);
            
            // Position on a sphere
            const radius = 12 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            object.position.x = radius * Math.sin(phi) * Math.cos(theta);
            object.position.y = radius * Math.sin(phi) * Math.sin(theta);
            object.position.z = radius * Math.cos(phi);
            
            // Random rotation
            object.rotation.x = Math.random() * Math.PI;
            object.rotation.y = Math.random() * Math.PI;
            
            // Random scale
            const scale = Math.random() * 0.5 + 0.8;
            object.scale.set(scale, scale, scale);
            
            objectsGroup.add(object);
            
            floatingObjects.push({
                mesh: object,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                orbitSpeed: Math.random() * 0.0008 + 0.0005,
                orbitRadius: radius,
                orbitAngle: theta,
                orbitPhase: Math.random() * Math.PI * 2 // For varied orbits
            });
        }
        
        // Add ambient lighting to the Projects scene
        const ambientLightProjects = new THREE.AmbientLight(0xffffff, 0.3); // Softer light for projects
        scene.add(ambientLightProjects);
        
        // Fade in animations
        gsap.from(wireframeMaterial, {
            opacity: 0,
            duration: ANIMATION.duration.medium,
            ease: ANIMATION.ease.smooth
        });
        
        gsap.from(scene.position, {
            z: 50,
            duration: ANIMATION.duration.slow,
            ease: ANIMATION.ease.smooth
        });
        
        // Staggered fade-in for each floating object
        floatingObjects.forEach((obj, index) => {
            gsap.from(obj.mesh.scale, {
                x: 0.01, y: 0.01, z: 0.01,
                duration: 1,
                delay: 0.05 * index,
                ease: ANIMATION.ease.bounce
            });
        });
        
        // Track mouse for interactivity with smooth damping
        const mousePosition = { x: 0.5, y: 0.5 };
        const targetRotation = { x: 0, y: 0 };
        const currentRotation = { x: 0, y: 0 };
        const rotationDamping = 0.05;
        
        document.addEventListener('mousemove', function(e) {
            mousePosition.x = e.clientX / window.innerWidth;
            mousePosition.y = e.clientY / window.innerHeight;
            
            // Calculate target rotation based on mouse
            targetRotation.x = (mousePosition.y - 0.5) * Math.PI * 0.3;
            targetRotation.y = (mousePosition.x - 0.5) * Math.PI * 0.3;
        });
        
        // Animation function with smooth damping
        function animateProjectsScene(clock) {
            // Create an interactive wave effect
            const time = clock.getElapsedTime();
            
            // Move particles based on mouse and time
            floatingObjects.forEach((object, i) => {
                const x = object.mesh.position.x;
                const y = object.mesh.position.y;
                const z = object.mesh.position.z;
                
                // Calculate distance from center
                const distanceFromCenter = Math.sqrt(x * x + z * z);
                
                // Create wave effect
                object.mesh.position.y = object.orbitRadius * Math.sin(time * 0.7 + distanceFromCenter * 0.5) * 2;
                
                // Add subtle rotation influenced by mouse position
                object.mesh.rotation.y += 0.01 + mousePosNorm.x * 0.005;
                object.mesh.rotation.x += 0.005 + mousePosNorm.y * 0.002;
                
                // Scale effect based on mouse proximity
                const mouseDistance = Math.sqrt(
                    Math.pow(x - mousePosNorm.x * 20, 2) + 
                    Math.pow(z - mousePosNorm.y * 20, 2)
                );
                
                const scaleFactor = 1 + Math.max(0, (5 - mouseDistance) / 5) * 0.3;
                object.mesh.scale.setScalar(object.mesh.scale.x * scaleFactor);
                
                // Color shift based on time and position
                if (object.mesh.material.color) {
                    const hue = (time * 0.05 + i * 0.01) % 1;
                    const color = new THREE.Color().setHSL(hue, 0.7, 0.6);
                    object.mesh.material.color.lerp(color, 0.02);
                }
            });
            
            // Add a gentle camera movement
            camera.position.x = Math.sin(time * 0.2) * 5;
            camera.position.y = Math.cos(time * 0.1) * 5 + 10;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        function handleResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        
        window.addEventListener('resize', handleResize);
        
        // Register with animation handler
        return animationHandler.register(animateProjectsScene);
    }
    
    // Remove any existing 3D backgrounds from About, Certifications, and Contact sections
    function removeUnnecessary3DBackgrounds() {
        console.log("Removing unnecessary 3D backgrounds...");
        
        // 1. Remove any 3D containers from these sections
        const sectionsToClean = ['about', 'certifications', 'contact', 'skills'];
        
        sectionsToClean.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                console.log(`Cleaning section: ${sectionId}`);
                
                // Remove 3D container if it exists
                const containers = section.querySelectorAll('.three-js-container');
                containers.forEach(container => {
                    console.log(`- Removing container from ${sectionId}`);
                    container.remove();
                });
                
                // Remove overlay if it exists
                const overlays = section.querySelectorAll('.three-js-overlay');
                overlays.forEach(overlay => {
                    console.log(`- Removing overlay from ${sectionId}`);
                    overlay.remove();
                });
                
                // Remove any canvas elements directly
                const canvases = section.querySelectorAll('canvas');
                canvases.forEach(canvas => {
                    console.log(`- Removing canvas from ${sectionId}`);
                    canvas.remove();
                });
                
                // Remove any WebGL contexts
                const webglElements = section.querySelectorAll('*[style*="webgl"]');
                webglElements.forEach(element => {
                    console.log(`- Removing WebGL element from ${sectionId}`);
                    element.remove();
                });
                
                // Remove any 3D-related classes
                const elements = section.querySelectorAll('*[class*="3d"], *[class*="three"]');
                elements.forEach(element => {
                    console.log(`- Removing 3D class element from ${sectionId}`);
                    // Remove only 3D-related classes, not the element itself
                    element.classList.remove(...Array.from(element.classList)
                        .filter(cls => cls.includes('3d') || cls.includes('three')));
                });
                
                // Set section background to transparent explicitly
                section.style.background = 'transparent';
                section.style.backgroundColor = 'transparent';
            }
        });
        
        // 2. Also clean up any specifically named containers
        const specificContainers = [
            'skills-3d-container',
            'about-3d-container',
            'certifications-3d-container',
            'contact-3d-container'
        ];
        
        specificContainers.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                console.log(`Removing specific container: ${id}`);
                element.remove();
            }
        });
        
        // 3. Extra cleanup - remove any overlay elements that might be related
        const overlays = document.querySelectorAll('.three-js-overlay');
        overlays.forEach(overlay => {
            const parent = overlay.parentElement;
            if (parent && (
                parent.id === 'about' || 
                parent.id === 'certifications' || 
                parent.id === 'contact' ||
                parent.id === 'skills'
            )) {
                console.log(`Removing overlay from ${parent.id}`);
                overlay.remove();
            }
        });
        
        // 4. Force transparent background on specific sections
        sectionsToClean.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                section.style.background = 'transparent !important';
                section.style.backgroundColor = 'transparent !important';
                
                // Make all children have transparent backgrounds as well
                const children = section.querySelectorAll('*');
                children.forEach(child => {
                    if (child.classList.contains('service-item') || 
                        child.classList.contains('stat') ||
                        child.classList.contains('certification-card') ||
                        child.classList.contains('contact-card') ||
                        child.classList.contains('social-card')) {
                        child.style.background = 'transparent';
                        child.style.backgroundColor = 'transparent';
                        child.style.backdropFilter = 'none';
                    }
                });
            }
        });
        
        console.log("Clean-up complete");
    }
    
    // Initialize all scenes and start animation
    initHeroScene();
    initProjectsScene();
    animationHandler.start();
    
    // Call the cleanup function immediately to ensure no 3D backgrounds exist
    removeUnnecessary3DBackgrounds();
    
    // Also call it with a small delay to ensure any dynamically added elements are cleaned up
    setTimeout(removeUnnecessary3DBackgrounds, 500);
    setTimeout(removeUnnecessary3DBackgrounds, 1000);
    
    // Intersection Observer for performance optimization
    // Only animate sections when they are visible
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                
                // Skip sections that should not have 3D backgrounds
                if (section.id === 'about' || section.id === 'certifications' || 
                    section.id === 'contact' || section.id === 'skills') {
                    // Ensure these sections remain clean of 3D elements
                    if (section.querySelector('.three-js-container')) {
                        console.log(`Found 3D container in ${section.id} - removing`);
                        removeUnnecessary3DBackgrounds();
                    }
                    return;
                }
                
                const containerId = section.querySelector('.three-js-container')?.id;
                if (containerId) {
                    // Toggle visibility of Three.js containers based on viewport
                    const container = document.getElementById(containerId);
                    if (container) {
                        // When section enters viewport, make visible with smooth opacity transition
                        if (entry.isIntersecting) {
                            gsap.to(container, {
                                autoAlpha: 1,
                                duration: 0.5
                            });
                        } else {
                            // When section exits viewport, hide with smooth opacity transition
                            gsap.to(container, {
                                autoAlpha: 0,
                                duration: 0.5
                            });
                        }
                    }
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1 // 10% of the target is visible
        });
        
        // Only observe hero and projects sections
        const sectionsToObserve = ['home', 'projects'];
        sectionsToObserve.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                sectionObserver.observe(section);
            }
        });
        
        // Also observe the sections that should remain clean, to ensure they stay that way
        const sectionsToKeepClean = ['about', 'certifications', 'contact', 'skills'];
        sectionsToKeepClean.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                sectionObserver.observe(section);
            }
        });
    }
    
    // Listen for theme changes
    document.addEventListener('themeChanged', function(e) {
        // Implement a smooth transition to new colors rather than reloading
        const newTheme = e.detail.theme;
        const newPrimaryColor = newTheme === 'dark' ? 0x4cc3d0 : 0x334cb0;
        const newSecondaryColor = newTheme === 'dark' ? 0x25aebe : 0x3596a6;
        
        // Find all Three.js materials in the DOM
        document.querySelectorAll('.three-js-container').forEach(container => {
            const canvas = container.querySelector('canvas');
            if (canvas) {
                const renderer = THREE.WebGLRenderer.getByCanvas(canvas);
                if (renderer && renderer.userData.scene) {
                    // Traverse the scene and update all materials
                    renderer.userData.scene.traverse(object => {
                        if (object.material) {
                            // Animate color transition using GSAP
                            gsap.to(object.material.color, {
                                r: (newPrimaryColor >> 16 & 255) / 255,
                                g: (newPrimaryColor >> 8 & 255) / 255,
                                b: (newPrimaryColor & 255) / 255,
                                duration: 1,
                                ease: "power2.inOut"
                            });
                        }
                    });
                }
            }
        });
        
        // Re-run cleanup to ensure transparency after theme change
        setTimeout(removeUnnecessary3DBackgrounds, 100);
        
        // Update ambient light on theme change
        const newLightIntensity = newTheme === 'dark' ? 0.5 : 0.3;
        gsap.to(ambientLightHero, { intensity: newLightIntensity, duration: 1 });
        gsap.to(ambientLightProjects, { intensity: newLightIntensity, duration: 1 });
    });

    // Set proper rendering order to ensure WebGL stays behind content
    const heroContainer = document.getElementById('hero-3d-container');
    const projectsContainer = document.getElementById('projects-3d-container');
    
    if (heroContainer) {
        heroContainer.style.zIndex = '-1';
        // Add a data attribute to track initialization
        heroContainer.setAttribute('data-initialized', 'false');
    }
    
    if (projectsContainer) {
        projectsContainer.style.zIndex = '-1';
        // Add a data attribute to track initialization
        projectsContainer.setAttribute('data-initialized', 'false');
    }
    
    // Create a function to check if the renderer is properly initialized
    function ensureProperRendering() {
        const containers = document.querySelectorAll('.three-js-container');
        containers.forEach(container => {
            // Ensure the container is properly styled
            container.style.zIndex = '-1';
            
            // Force a reflow to ensure proper stacking context
            container.style.display = 'none';
            const _ = container.offsetHeight; // Force reflow
            container.style.display = 'block';
        });
    }
    
    // Run the check after a slight delay to ensure DOM is fully processed
    setTimeout(ensureProperRendering, 500);
    
    // Add an intersection observer to improve performance and fix potential rendering issues
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const container = section.querySelector('.three-js-container');
            
            if (container) {
                if (entry.isIntersecting) {
                    // Only animate when in view
                    container.style.opacity = '1';
                } else {
                    // Reduce opacity when out of view to improve performance
                    container.style.opacity = '0.1';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });
    
    // Observe all sections with WebGL
    sections.forEach(section => {
        if (section.querySelector('.three-js-container')) {
            observer.observe(section);
        }
    });

    // Add function to create a mask around the profile image to keep WebGL effects away
    function createProfileImageMask() {
        // Find the profile image element
        const profileImage = document.querySelector('.profile-image');
        
        if (profileImage) {
            // Get the bounding rectangle
            const rect = profileImage.getBoundingClientRect();
            
            // Create an invisible div that will block WebGL elements
            const mask = document.createElement('div');
            mask.className = 'profile-image-mask';
            mask.style.position = 'absolute';
            mask.style.top = rect.top + 'px';
            mask.style.left = rect.left + 'px';
            mask.style.width = rect.width + 'px';
            mask.style.height = rect.height + 'px';
            mask.style.zIndex = '15';
            mask.style.pointerEvents = 'none';
            
            // Add to the body
            document.body.appendChild(mask);
            
            // Update on window resize
            window.addEventListener('resize', () => {
                const updatedRect = profileImage.getBoundingClientRect();
                mask.style.top = updatedRect.top + 'px';
                mask.style.left = updatedRect.left + 'px';
                mask.style.width = updatedRect.width + 'px';
                mask.style.height = updatedRect.height + 'px';
            });
        }
    }

    // Make sure the WebGL renderer respects the profile image position
    document.addEventListener('DOMContentLoaded', function() {
        // Create the profile image mask
        setTimeout(createProfileImageMask, 500); // Wait for page to load fully
        
        // Ensure WebGL elements stay away from the profile image
        const heroContainer = document.getElementById('hero-3d-container');
        if (heroContainer && heroContainer.style) {
            // Force lower z-index
            heroContainer.style.zIndex = '-10';
        }
    });
}); 