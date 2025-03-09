// Interactive Fragments Script

document.addEventListener('DOMContentLoaded', function() {
    // Initialize fragments
    initializeFragments();
    
    // Track mouse movement to update fragments
    document.addEventListener('mousemove', function(e) {
        updateFragmentsNearCursor(e.clientX, e.clientY);
    });
    
    // Add more fragments on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(scrollTop - lastScrollTop) > 50) {
            addMoreFragments(3);
            lastScrollTop = scrollTop;
        }
    });
});

// Initialize fragments with random positions
function initializeFragments() {
    const fragments = document.querySelectorAll('.fragment');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    fragments.forEach(fragment => {
        // Set random positions
        const x = Math.random() * windowWidth;
        const y = Math.random() * windowHeight;
        
        // Set random opacity
        const opacity = 0.1 + Math.random() * 0.3;
        
        // Apply styles
        fragment.style.left = `${x}px`;
        fragment.style.top = `${y}px`;
        fragment.style.opacity = opacity;
        
        // Add random delay for initial animation
        const delay = Math.random() * 2;
        fragment.style.transitionDelay = `${delay}s`;
    });
}

// Update fragments near the cursor
function updateFragmentsNearCursor(x, y) {
    const fragments = document.querySelectorAll('.fragment');
    const activationDistance = 300; // Distance in pixels to activate fragments
    
    fragments.forEach(fragment => {
        // Get fragment position
        const fragmentX = parseFloat(fragment.style.left);
        const fragmentY = parseFloat(fragment.style.top);
        
        // Calculate distance from cursor
        const dx = x - fragmentX;
        const dy = y - fragmentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If fragment is close to cursor, activate it
        if (distance < activationDistance) {
            // Calculate movement based on distance (closer = more movement)
            const factor = 1 - (distance / activationDistance);
            const moveX = dx * factor * 0.1;
            const moveY = dy * factor * 0.1;
            
            // Apply subtle movement away from cursor
            fragment.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
            fragment.classList.add('active');
            
            // Reset after a delay
            setTimeout(() => {
                fragment.classList.remove('active');
                fragment.style.transform = '';
            }, 1000);
        }
    });
}

// Add more fragments dynamically
function addMoreFragments(count) {
    const container = document.querySelector('.fragments-container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    for (let i = 0; i < count; i++) {
        const fragment = document.createElement('div');
        fragment.className = 'fragment';
        
        // Set random positions
        const x = Math.random() * windowWidth;
        const y = Math.random() * windowHeight;
        
        // Set random opacity
        const opacity = 0.1 + Math.random() * 0.2;
        
        // Apply styles
        fragment.style.left = `${x}px`;
        fragment.style.top = `${y}px`;
        fragment.style.opacity = opacity;
        
        // Add to container
        container.appendChild(fragment);
        
        // Remove after animation completes to prevent too many elements
        setTimeout(() => {
            fragment.remove();
        }, 5000);
    }
} 