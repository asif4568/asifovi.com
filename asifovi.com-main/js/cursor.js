// Custom cursor implementation with fixed position
document.addEventListener('DOMContentLoaded', function() {
    // Get cursor elements
    const cursorGlow = document.querySelector('.cursor-glow');
    const cursorGlowSmall = document.querySelector('.cursor-glow-small');
    
    // Only activate on desktop
    if (cursorGlow && cursorGlowSmall && window.innerWidth > 768) {
        // Initial positioning in the center of the screen
        cursorGlow.style.opacity = '1';
        cursorGlowSmall.style.opacity = '1';
        
        cursorGlow.style.left = (window.innerWidth / 2) + 'px';
        cursorGlow.style.top = (window.innerHeight / 2) + 'px';
        
        cursorGlowSmall.style.left = (window.innerWidth / 2) + 'px';
        cursorGlowSmall.style.top = (window.innerHeight / 2) + 'px';
        
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // Direct mouse tracking using fixed position
        document.addEventListener('mousemove', function(e) {
            // Fixed position tracking - clientX/Y works better with fixed position
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            
            cursorGlowSmall.style.left = e.clientX + 'px';
            cursorGlowSmall.style.top = e.clientY + 'px';
        });
        
        // Apply cursor:none to all interactive elements
        const allElements = document.querySelectorAll('a, button, .service-item, .skill-item, .project-card, .contact-item, .nav-links li, .hamburger, .theme-toggle');
        allElements.forEach(function(el) {
            el.style.cursor = 'none';
        });
        
        // Add hover effects to interactive elements
        allElements.forEach(function(el) {
            el.addEventListener('mouseenter', function() {
                cursorGlow.style.width = '300px';
                cursorGlow.style.height = '300px';
                cursorGlow.style.marginLeft = '-150px';
                cursorGlow.style.marginTop = '-150px';
                cursorGlow.style.opacity = '1';
                
                cursorGlowSmall.style.width = '15px';
                cursorGlowSmall.style.height = '15px';
                cursorGlowSmall.style.marginLeft = '-7.5px';
                cursorGlowSmall.style.marginTop = '-7.5px';
                cursorGlowSmall.style.background = 'rgb(69, 39, 204)';
            });
            
            el.addEventListener('mouseleave', function() {
                cursorGlow.style.width = '250px';
                cursorGlow.style.height = '250px';
                cursorGlow.style.marginLeft = '-125px';
                cursorGlow.style.marginTop = '-125px';
                cursorGlow.style.opacity = '0.95';
                
                cursorGlowSmall.style.width = '10px';
                cursorGlowSmall.style.height = '10px';
                cursorGlowSmall.style.marginLeft = '-5px';
                cursorGlowSmall.style.marginTop = '-5px';
                cursorGlowSmall.style.background = 'rgba(63, 133, 238, 0.9)';
            });
        });
        
        // Ensure cursor stays visible during interactions
        ['mousedown', 'mouseup', 'click'].forEach(function(eventType) {
            document.addEventListener(eventType, function() {
                cursorGlowSmall.style.transform = 'scale(0.8)';
                setTimeout(function() {
                    cursorGlowSmall.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }
}); 