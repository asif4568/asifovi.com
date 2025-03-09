// Seasonal Effects Script - Currently Disabled
document.addEventListener('DOMContentLoaded', function() {
    // Remove any seasonal classes from the body
    document.body.classList.remove('winter-theme', 'spring-theme', 'summer-theme', 'fall-theme');
    
    // Remove any existing snowfall canvas
    const existingCanvas = document.getElementById('snowfall-canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Clear any inline styles that might have been applied by seasonal effects
    const elements = document.querySelectorAll('.skill-icon i, .service-icon i, .certification-icon i, .contact-icon i');
    elements.forEach(element => {
        // Remove any inline color styling
        element.style.removeProperty('color');
    });
    
    // Remove event listener for theme changes
    document.removeEventListener('themeChanged', function() {});
    
    console.log("Seasonal effects have been disabled.");
});

/**
 * Check the current season based on date and apply the appropriate seasonal effect
 */
function checkSeasonAndApplyEffect() {
    const currentDate = new Date();
    const month = currentDate.getMonth(); // 0-11 (Jan-Dec)
    const day = currentDate.getDate(); // 1-31
    
    // Determine hemisphere based on geolocation if possible
    // Defaulting to Northern Hemisphere for now
    const isNorthernHemisphere = true;
    
    // Define seasons for Northern Hemisphere
    let isWinter = false;
    
    if (isNorthernHemisphere) {
        // Northern Hemisphere: Winter is approximately December to February
        isWinter = (month === 11) || (month >= 0 && month <= 1);
    } else {
        // Southern Hemisphere: Winter is approximately June to August
        isWinter = (month >= 5 && month <= 7);
    }
    
    // Apply appropriate seasonal effect
    if (isWinter) {
        // Check if already applied
        if (!document.body.classList.contains('winter-theme')) {
            // Remove any other seasonal classes first
            document.body.classList.remove('spring-theme', 'summer-theme', 'fall-theme');
            
            // Add winter theme class
            document.body.classList.add('winter-theme');
            
            // Start snowfall
            initSnowfall();
            
            console.log("Winter detected! Applying snowfall effect.");
        }
    } else {
        // Check if already applied
        if (!document.body.classList.contains('spring-theme')) {
            // Remove any other seasonal classes first
            document.body.classList.remove('winter-theme', 'summer-theme', 'fall-theme');
            
            // Remove any existing snowfall canvas
            const existingCanvas = document.getElementById('snowfall-canvas');
            if (existingCanvas) {
                existingCanvas.remove();
            }
            
            // Add spring theme class
            document.body.classList.add('spring-theme');
            
            console.log("It's not winter, using spring theme.");
        }
    }
    
    // Force refresh of icon colors
    refreshSeasonalStyles();
}

/**
 * Force refresh of seasonal styles by briefly toggling a class
 */
function refreshSeasonalStyles() {
    // Apply a temporary class
    document.body.classList.add('refreshing-seasonal-styles');
    
    // Force icon style updates by directly accessing icon elements
    const allIcons = document.querySelectorAll('.skill-icon i, .service-icon i, .certification-icon i, .contact-icon i');
    
    // Determine which color to apply based on current season theme
    let iconColor = null;
    if (document.body.classList.contains('winter-theme')) {
        iconColor = getComputedStyle(document.documentElement).getPropertyValue('--winter-accent-color').trim();
    } else if (document.body.classList.contains('spring-theme')) {
        iconColor = getComputedStyle(document.documentElement).getPropertyValue('--spring-accent-color').trim();
    }
    
    // Apply the color directly to each icon if a seasonal theme is active
    if (iconColor) {
        allIcons.forEach(icon => {
            // Set direct inline style with !important to override any other styles
            icon.style.setProperty('color', iconColor, 'important');
        });
    }
    
    // Remove the temporary class after a brief delay
    setTimeout(() => {
        document.body.classList.remove('refreshing-seasonal-styles');
    }, 50);
    
    console.log(`Refreshed seasonal styles with color: ${iconColor || 'default'}`);
}

/**
 * Initialize snowfall effect with canvas
 */
function initSnowfall() {
    // Remove any existing snowfall canvas first
    const existingCanvas = document.getElementById('snowfall-canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    // Create canvas element for snowfall
    const snowCanvas = document.createElement('canvas');
    snowCanvas.id = 'snowfall-canvas';
    snowCanvas.style.position = 'fixed';
    snowCanvas.style.top = '0';
    snowCanvas.style.left = '0';
    snowCanvas.style.width = '100%';
    snowCanvas.style.height = '100%';
    snowCanvas.style.pointerEvents = 'none';
    snowCanvas.style.zIndex = '0'; // Behind content but in front of background
    document.body.prepend(snowCanvas);
    
    // Get canvas context
    const ctx = snowCanvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        snowCanvas.width = window.innerWidth;
        snowCanvas.height = window.innerHeight;
    }
    
    // Listen for window resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Snowflake configuration
    const maxSnowflakes = 200; // Adjust based on performance
    const snowflakes = [];
    
    // Color based on theme
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const snowColor = isDarkTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)';
    
    // Initialize snowflakes
    for (let i = 0; i < maxSnowflakes; i++) {
        snowflakes.push({
            x: Math.random() * snowCanvas.width,
            y: Math.random() * snowCanvas.height,
            radius: Math.random() * 4 + 1,
            density: Math.random() * maxSnowflakes,
            speed: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.5 + 0.3
        });
    }
    
    // Draw and animate snowflakes
    function drawSnowflakes() {
        ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
        ctx.fillStyle = snowColor;
        ctx.beginPath();
        
        for (let i = 0; i < maxSnowflakes; i++) {
            const snowflake = snowflakes[i];
            ctx.moveTo(snowflake.x, snowflake.y);
            ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2, true);
        }
        
        ctx.fill();
        moveSnowflakes();
    }
    
    // Move snowflakes
    function moveSnowflakes() {
        for (let i = 0; i < maxSnowflakes; i++) {
            const snowflake = snowflakes[i];
            
            // Gentle sideways movement
            snowflake.x += Math.sin(snowflake.density + snowflake.y / 100) * 0.3;
            
            // Downward movement
            snowflake.y += snowflake.speed;
            
            // If snowflake reaches the bottom, send it back to the top
            if (snowflake.y > snowCanvas.height) {
                snowflakes[i] = {
                    x: Math.random() * snowCanvas.width,
                    y: 0,
                    radius: snowflake.radius,
                    density: snowflake.density,
                    speed: snowflake.speed,
                    opacity: snowflake.opacity
                };
            }
        }
    }
    
    // Animation loop
    function animateSnowfall() {
        drawSnowflakes();
        requestAnimationFrame(animateSnowfall);
    }
    
    // Listen for theme changes
    document.addEventListener('themeChanged', function(e) {
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        const snowColor = isDarkTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)';
    });
    
    // Start the animation
    animateSnowfall();
}

/**
 * Helper function to get a random number between a range
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
} 