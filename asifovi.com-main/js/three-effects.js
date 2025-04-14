// Three.js 3D effects for portfolio website
document.addEventListener('DOMContentLoaded', function() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded!');
        return;
    }

    // Get theme
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Scene managers for different sections
    const sceneManagers = {};
    
    // Listen for theme changes
    document.addEventListener('themeChanged', function(e) {
        const newTheme = e.detail.theme;
        // Update scene colors based on theme
        updateSceneColors(newTheme === 'dark');
    });
    
    function updateSceneColors(isDark) {
        // Update all scene colors when theme changes
        Object.values(sceneManagers).forEach(manager => {
            if (typeof manager.updateColors === 'function') {
                manager.updateColors(isDark);
            }
        });
    }

    // ----------------------
    // HERO SECTION 3D EFFECT
    // ----------------------
    function initHeroScene() {
        const container = document.getElementById('hero-3d-container');
        if (!container) return null;
        
        // Scene setup
        const scene = new THREE.Scene();
        
        // Camera setup - perspective camera for 3D effect
        const camera = new THREE.PerspectiveCamera(
            75, // Field of view
            container.clientWidth / container.clientHeight, // Aspect ratio
            0.1, // Near plane
            1000 // Far plane
        );
        camera.position.z = 25;
        
        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Particles setup
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        
        // Arrays to hold particle positions
        const posArray = new Float32Array(particlesCount * 3);
        
        // Fill with random positions
        for (let i = 0; i < particlesCount * 3; i += 3) {
            // Create a sphere distribution
            const radius = 15 + Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            posArray[i] = radius * Math.sin(phi) * Math.cos(theta); // x
            posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
            posArray[i + 2] = radius * Math.cos(phi); // z
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        // Particle material
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            sizeAttenuation: true,
            transparent: true,
            alphaTest: 0.5,
            opacity: 0.8,
            color: isDarkTheme ? 0x4cc3d0 : 0x334cb0
        });
        
        // Create particles
        const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
        scene.add(particleSystem);
        
        // Add connecting lines between particles
        const linesMaterial = new THREE.LineBasicMaterial({
            color: isDarkTheme ? 0x4cc3d0 : 0x334cb0,
            transparent: true,
            opacity: 0.1,
            linewidth: 1
        });
        
        const linesGeometry = new THREE.BufferGeometry();
        const linesPositions = new Float32Array(particlesCount * 2 * 3); // Each line needs 2 points
        const linesCount = particlesCount / 3; // Use fewer lines than particles
        
        for (let i = 0; i < linesCount; i++) {
            // Connect random particles that are close to each other
            const idx1 = Math.floor(Math.random() * particlesCount);
            let idx2 = idx1;
            
            // Find a different particle
            while (idx2 === idx1) {
                idx2 = Math.floor(Math.random() * particlesCount);
            }
            
            // Start point
            linesPositions[i * 6] = posArray[idx1 * 3];
            linesPositions[i * 6 + 1] = posArray[idx1 * 3 + 1];
            linesPositions[i * 6 + 2] = posArray[idx1 * 3 + 2];
            
            // End point
            linesPositions[i * 6 + 3] = posArray[idx2 * 3];
            linesPositions[i * 6 + 4] = posArray[idx2 * 3 + 1];
            linesPositions[i * 6 + 5] = posArray[idx2 * 3 + 2];
        }
        
        linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3));
        const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
        scene.add(lines);
        
        // Add a subtle glow to the scene
        const glowGeometry = new THREE.SphereGeometry(12, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: isDarkTheme ? 0x4cc3d0 : 0x334cb0,
            transparent: true,
            opacity: 0.03
        });
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glowSphere);
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate the particle system
            particleSystem.rotation.x += 0.0003;
            particleSystem.rotation.y += 0.0005;
            
            // Rotate the lines in the opposite direction for interesting effect
            lines.rotation.x -= 0.0002;
            lines.rotation.y -= 0.0004;
            
            // Subtle scaling animation for the glow
            const time = Date.now() * 0.001;
            glowSphere.scale.set(
                1 + Math.sin(time * 0.3) * 0.05,
                1 + Math.sin(time * 0.5) * 0.05,
                1 + Math.sin(time * 0.4) * 0.05
            );
            
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        function handleResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
        
        window.addEventListener('resize', handleResize);
        
        // Start animation
        animate();
        
        // Update colors based on theme
        function updateColors(isDark) {
            particleMaterial.color.set(isDark ? 0x4cc3d0 : 0x334cb0);
            linesMaterial.color.set(isDark ? 0x4cc3d0 : 0x334cb0);
            glowMaterial.color.set(isDark ? 0x4cc3d0 : 0x334cb0);
        }
        
        return {
            scene,
            camera,
            renderer,
            updateColors
        };
    }
    
    // ----------------------
    // SKILLS SECTION 3D EFFECT
    // ----------------------
    function initSkillsScene() {
        const container = document.getElementById('skills-3d-container');
        if (!container) return null;
        
        // Set up scene
        const scene = new THREE.Scene();
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            60,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 20;
        
        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Create floating 3D shapes
        const shapes = [];
        const shapeTypes = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.8, 16, 16),
            new THREE.TetrahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(0.8, 0),
            new THREE.TorusGeometry(0.7, 0.3, 16, 32)
        ];
        
        // Create 20 random shapes
        for (let i = 0; i < 20; i++) {
            const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            const material = new THREE.MeshBasicMaterial({
                color: isDarkTheme ? 0x4cc3d0 : 0x334cb0,
                wireframe: Math.random() > 0.5, // Some wireframe, some solid
                transparent: true,
                opacity: Math.random() * 0.5 + 0.3
            });
            
            const shape = new THREE.Mesh(shapeType, material);
            
            // Random position
            shape.position.x = (Math.random() - 0.5) * 30;
            shape.position.y = (Math.random() - 0.5) * 30;
            shape.position.z = (Math.random() - 0.5) * 30 - 10; // Push most shapes back
            
            // Random rotation
            shape.rotation.x = Math.random() * Math.PI * 2;
            shape.rotation.y = Math.random() * Math.PI * 2;
            shape.rotation.z = Math.random() * Math.PI * 2;
            
            // Random size
            const scale = Math.random() * 0.5 + 0.5;
            shape.scale.set(scale, scale, scale);
            
            scene.add(shape);
            
            shapes.push({
                mesh: shape,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                },
                floatSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.005
                },
                bounds: {
                    min: -15,
                    max: 15
                }
            });
        }
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            
            // Animate shapes
            shapes.forEach(shape => {
                // Rotate
                shape.mesh.rotation.x += shape.rotationSpeed.x;
                shape.mesh.rotation.y += shape.rotationSpeed.y;
                shape.mesh.rotation.z += shape.rotationSpeed.z;
                
                // Float and bounce off bounds
                shape.mesh.position.x += shape.floatSpeed.x;
                shape.mesh.position.y += shape.floatSpeed.y;
                shape.mesh.position.z += shape.floatSpeed.z;
                
                // Bounce off bounds
                if (shape.mesh.position.x < shape.bounds.min || shape.mesh.position.x > shape.bounds.max) {
                    shape.floatSpeed.x *= -1;
                }
                if (shape.mesh.position.y < shape.bounds.min || shape.mesh.position.y > shape.bounds.max) {
                    shape.floatSpeed.y *= -1;
                }
                if (shape.mesh.position.z < shape.bounds.min - 10 || shape.mesh.position.z > shape.bounds.max - 10) {
                    shape.floatSpeed.z *= -1;
                }
            });
            
            // Slowly rotate camera around scene
            camera.position.x = Math.sin(Date.now() * 0.0001) * 5;
            camera.position.y = Math.cos(Date.now() * 0.0001) * 5;
            camera.lookAt(0, 0, 0);
            
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        function handleResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
        
        window.addEventListener('resize', handleResize);
        
        // Start animation
        animate();
        
        // Update colors based on theme
        function updateColors(isDark) {
            shapes.forEach(shape => {
                shape.mesh.material.color.set(isDark ? 0x4cc3d0 : 0x334cb0);
            });
        }
        
        return {
            scene,
            camera,
            renderer,
            updateColors
        };
    }
    
    // ----------------------
    // PROJECTS SECTION 3D EFFECT
    // ----------------------
    function initProjectsScene() {
        const container = document.getElementById('projects-3d-container');
        if (!container) return null;
        
        // Set up scene
        const scene = new THREE.Scene();
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            70,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 20;
        
        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Create a wireframe sphere
        const sphereGeometry = new THREE.IcosahedronGeometry(10, 2);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: isDarkTheme ? 0x4cc3d0 : 0x334cb0,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const sphere = new THREE.Mesh(sphereGeometry, wireframeMaterial);
        scene.add(sphere);
        
        // Add vertices as points
        const pointsGeometry = new THREE.BufferGeometry();
        pointsGeometry.setAttribute('position', sphereGeometry.getAttribute('position'));
        
        const pointsMaterial = new THREE.PointsMaterial({
            color: isDarkTheme ? 0x25aebe : 0x3596a6,
            size: 0.2,
            transparent: true,
            opacity: 0.8
        });
        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        scene.add(points);
        
        // Create floating 3D objects around the sphere
        const objectsGroup = new THREE.Group();
        scene.add(objectsGroup);
        
        // Different geometries for visual interest
        const geometries = [
            new THREE.TetrahedronGeometry(0.8, 0),
            new THREE.OctahedronGeometry(0.8, 0),
            new THREE.IcosahedronGeometry(0.8, 0),
            new THREE.TorusGeometry(0.5, 0.2, 8, 16)
        ];
        
        const floatingObjects = [];
        
        for (let i = 0; i < 20; i++) {
            const geomIndex = Math.floor(Math.random() * geometries.length);
            const geometry = geometries[geomIndex];
            
            const material = new THREE.MeshBasicMaterial({
                color: isDarkTheme ? 0x4cc3d0 : 0x334cb0,
                wireframe: true,
                transparent: true,
                opacity: Math.random() * 0.5 + 0.3
            });
            
            const object = new THREE.Mesh(geometry, material);
            
            // Position on a larger sphere
            const radius = 12 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            object.position.x = radius * Math.sin(phi) * Math.cos(theta);
            object.position.y = radius * Math.sin(phi) * Math.sin(theta);
            object.position.z = radius * Math.cos(phi);
            
            // Random rotation
            object.rotation.x = Math.random() * Math.PI;
            object.rotation.y = Math.random() * Math.PI;
            object.rotation.z = Math.random() * Math.PI;
            
            objectsGroup.add(object);
            
            floatingObjects.push({
                mesh: object,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                orbitSpeed: Math.random() * 0.001 + 0.0005,
                orbitRadius: radius,
                orbitAngle: theta
            });
        }
        
        // Track mouse position for interactive rotation
        const mousePosition = { x: 0.5, y: 0.5 };
        
        document.addEventListener('mousemove', function(e) {
            mousePosition.x = e.clientX / window.innerWidth;
            mousePosition.y = e.clientY / window.innerHeight;
        });
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate the main sphere slowly
            sphere.rotation.y += 0.001;
            points.rotation.y += 0.001;
            
            // Rotate and orbit floating objects
            floatingObjects.forEach(object => {
                object.mesh.rotation.x += object.rotationSpeed.x;
                object.mesh.rotation.y += object.rotationSpeed.y;
                object.mesh.rotation.z += object.rotationSpeed.z;
                
                // Orbit around the center
                object.orbitAngle += object.orbitSpeed;
                
                object.mesh.position.x = object.orbitRadius * Math.cos(object.orbitAngle);
                object.mesh.position.z = object.orbitRadius * Math.sin(object.orbitAngle);
            });
            
            // Interactive rotation based on mouse position
            const mouseX = (mousePosition.x - 0.5) * 2;
            const mouseY = (mousePosition.y - 0.5) * 2;
            
            // Apply smooth rotation based on mouse position
            const targetRotationX = mouseY * 0.3;
            const targetRotationY = mouseX * 0.3;
            
            objectsGroup.rotation.x += (targetRotationX - objectsGroup.rotation.x) * 0.05;
            objectsGroup.rotation.y += (targetRotationY - objectsGroup.rotation.y) * 0.05;
            
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        function handleResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
        
        window.addEventListener('resize', handleResize);
        
        // Start animation
        animate();
        
        // Update colors based on theme
        function updateColors(isDark) {
            wireframeMaterial.color.set(isDark ? 0x4cc3d0 : 0x334cb0);
            pointsMaterial.color.set(isDark ? 0x25aebe : 0x3596a6);
            
            floatingObjects.forEach(object => {
                object.mesh.material.color.set(isDark ? 0x4cc3d0 : 0x334cb0);
            });
        }
        
        return {
            scene,
            camera,
            renderer,
            updateColors
        };
    }
    
    // Initialize all 3D scenes
    sceneManagers.hero = initHeroScene();
    sceneManagers.skills = initSkillsScene();
    sceneManagers.projects = initProjectsScene();
}); 