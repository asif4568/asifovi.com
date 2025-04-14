/**
 * Background Music Player
 * Handles the audio player functionality for the portfolio website
 */

// Simplified Audio Player - No Text
document.addEventListener('DOMContentLoaded', function() {
    const audioToggle = document.getElementById('audioToggle');
    const volumeControl = document.getElementById('volumeControl');
    const bgMusic = document.getElementById('bgMusic');
    
    // Remove disabled attribute that might prevent interaction
    audioToggle.removeAttribute('disabled');
    
    // Initialize volume
    bgMusic.volume = volumeControl.value;
    
    // Toggle audio playback when the button is clicked
    audioToggle.addEventListener('click', function() {
        if (bgMusic.paused) {
            // Play the audio
            const playPromise = bgMusic.play();
            
            // Handle the play promise (required for modern browsers)
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Playback started successfully
                    audioToggle.classList.add('playing');
                    createMusicRipples();
                }).catch(error => {
                    // Auto-play was prevented
                    console.error('Audio playback failed:', error);
                });
            }
        } else {
            // Pause the audio
            bgMusic.pause();
            audioToggle.classList.remove('playing');
            if (window.musicRippleInterval) {
                clearInterval(window.musicRippleInterval);
            }
        }
    });
    
    // Update volume when the slider is changed
    volumeControl.addEventListener('input', function() {
        bgMusic.volume = this.value;
    });
    
    // Create ripple effects in sync with music if the feature is available
    function createMusicRipples() {
        if (window.waterRippleInstance && typeof window.waterRippleInstance.createRipple === 'function') {
            // Clear any existing interval
            if (window.musicRippleInterval) {
                clearInterval(window.musicRippleInterval);
            }
            
            // Create new ripples at an interval
            window.musicRippleInterval = setInterval(() => {
                if (bgMusic.paused) {
                    clearInterval(window.musicRippleInterval);
                    return;
                }
                
                // Create a ripple at a random position
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                window.waterRippleInstance.createRipple(x, y, Math.random() * 3 + 2);
            }, 2000);
        }
    }
    
    // Add animations for the music button
    function addButtonAnimations() {
        // Add keyframes for the pulse animation if they don't exist
        if (!document.querySelector('style#audio-animations')) {
            const style = document.createElement('style');
            style.id = 'audio-animations';
            style.textContent = `
                @keyframes pulse-light {
                    0% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.5); }
                    70% { box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); }
                    100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); }
                }
                
                @keyframes beat {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.2); }
                }
                
                .volume-control::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .volume-control::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.5);
                }
                
                .volume-control::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                }
                
                .volume-control::-moz-range-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.5);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize button animations
    addButtonAnimations();
}); 